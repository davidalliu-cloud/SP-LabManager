import { createClient } from "@supabase/supabase-js";

/**
 * Sending mail with files attached, and deciding who may do it.
 *
 * `mailto:` cannot carry a file — no mail client will attach one — so anything
 * that has to leave with a PDF on it goes through Microsoft Graph, using the
 * Mail.Send application permission the daily digest already has, scoped by
 * ApplicationAccessPolicy to njoftime@sarpandlab.al.
 *
 * Mail leaves as njoftime@, with Reply-To set to whoever pressed the button so
 * the client's reply lands with a person rather than a notifications mailbox.
 *
 * Extracted from the report send route when client summaries needed the same
 * thing. One copy, because a second would be the one that quietly stops
 * checking who is allowed to send.
 */

/** Graph rejects a request body over ~4 MB. Base64 inflates by ~4/3, so the
 *  raw total is capped below that and said plainly rather than failing at the API. */
export const MAX_TOTAL_PDF_BYTES = 2_800_000;

/**
 * Who may release a document to a client.
 *
 * Reports and summaries are the same decision — both leave the lab in the
 * lab's name — so they answer to the same two people.
 */
const ALLOWED_SENDERS = ["d.alliu@sarpandlab.al", "a.duzha@sarpandlab.al"];

export type SenderIdentity = { email: string };

/** Confirms the caller is signed in and permitted to send. Never trusts the browser. */
export async function authoriseSender(request: Request): Promise<SenderIdentity | { error: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return { error: "Supabase is not configured." };

  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return { error: "Not signed in." };

  const supabase = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data, error } = await supabase.auth.getUser(token);
  const email = data?.user?.email?.trim().toLowerCase();
  if (error || !email) return { error: "Not signed in." };
  if (!ALLOWED_SENDERS.includes(email)) return { error: "You are not permitted to send to clients." };
  return { email };
}

export async function getGraphToken() {
  const tenantId = process.env.MS_TENANT_ID;
  const clientId = process.env.MS_CLIENT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing MS_TENANT_ID / MS_CLIENT_ID / MS_CLIENT_SECRET.");
  }
  const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials"
    })
  });
  if (!response.ok) throw new Error(`Graph token error ${response.status}: ${await response.text()}`);
  return ((await response.json()) as { access_token: string }).access_token;
}

export type GraphAttachment = {
  "@odata.type": string;
  name: string;
  contentType: string;
  contentBytes: string;
};

/** Downloads a stored PDF and prepares it for Graph, or explains why it could not. */
export async function pdfAttachment(
  pdfUrl: string,
  name: string
): Promise<{ attachment: GraphAttachment; bytes: number } | { error: string }> {
  const file = await fetch(pdfUrl);
  if (!file.ok) return { error: `Could not download the PDF for ${name}.` };
  const buffer = Buffer.from(await file.arrayBuffer());
  return {
    bytes: buffer.byteLength,
    attachment: {
      "@odata.type": "#microsoft.graph.fileAttachment",
      name: name.endsWith(".pdf") ? name : `${name}.pdf`,
      contentType: "application/pdf",
      contentBytes: buffer.toString("base64")
    }
  };
}

export async function sendMail(options: {
  to: string;
  replyTo: string;
  subject: string;
  body: string;
  attachments: GraphAttachment[];
}) {
  const mailbox = process.env.MS_SENDER_MAILBOX || "njoftime@sarpandlab.al";
  const token = await getGraphToken();
  const response = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/sendMail`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: {
        subject: options.subject,
        body: { contentType: "Text", content: options.body },
        toRecipients: [{ emailAddress: { address: options.to } }],
        replyTo: [{ emailAddress: { address: options.replyTo } }],
        attachments: options.attachments
      },
      saveToSentItems: "true"
    })
  });
  if (!response.ok) {
    throw new Error(`Graph rejected the send (${response.status}): ${await response.text()}`);
  }
  return { mailbox };
}
