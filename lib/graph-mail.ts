import { signedInEmail } from "./api-auth";

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

/**
 * How much PDF one mail may carry.
 *
 * Graph rejects a request body over ~4 MB and base64 inflates by ~4/3, so a
 * small batch leaves in a single sendMail call. Anything larger is built as a
 * draft with each file uploaded into it a piece at a time, which Graph allows
 * up to 150 MB a file. Both ways out are below; the caller picks neither.
 *
 * What caps it after that is the mail servers, not Graph. Exchange Online
 * allows 25 MB a message by default and SMTP counts the encoded size, so the
 * raw total is held at 15 MB - about thirty certificates, and roughly 20 MB on
 * the wire. A client whose own server is stricter will refuse it before that,
 * and the refusal comes back to njoftime@.
 */
export const MAX_TOTAL_PDF_BYTES = 15_000_000;

/** Under this the whole mail, attachments and all, fits in one Graph request. */
const INLINE_TOTAL_BYTES = 2_800_000;

/** Graph requires every chunk but the last to be a multiple of 320 KiB. */
const UPLOAD_CHUNK_BYTES = 320 * 1024 * 10;

/**
 * Who may release a document to a client.
 *
 * Reports and summaries are the same decision — both leave the lab in the
 * lab's name — so they answer to the same two people.
 */
const ALLOWED_SENDERS = ["d.alliu@sarpandlab.al", "a.duzha@sarpandlab.al"];

export type SenderIdentity = { email: string };

/**
 * The addresses typed into a send box, as a list.
 *
 * A report rarely goes to one person: the site engineer gets it and the office
 * is copied, or two engineers share the job. The box takes them separated by
 * commas, semicolons or spaces, because that is how a list of addresses is
 * already written and how Outlook pastes one back.
 *
 * The same address twice — typed once in each box, or pasted twice — is one
 * recipient, not two copies of the mail.
 */
export function parseRecipients(value: string | string[] | undefined | null): string[] {
  const raw = Array.isArray(value) ? value : String(value ?? "").split(/[,;\s]+/);
  const seen = new Set<string>();
  const list: string[] = [];
  for (const entry of raw) {
    const address = String(entry ?? "").trim();
    if (!address || seen.has(address.toLowerCase())) continue;
    seen.add(address.toLowerCase());
    list.push(address);
  }
  return list;
}

/**
 * How many people one send may reach.
 *
 * Not a Graph limit — a guard against the slip that matters here, pasting a
 * column of addresses into the wrong box and mailing one client's reports to
 * everyone in it.
 */
export const MAX_RECIPIENTS = 20;

/** Anything in the list that is not an address, so the refusal can name it. */
export function invalidRecipients(list: string[]): string[] {
  return list.filter((address) => !/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(address));
}

/** The copies, with anyone already on the main line dropped. */
export function withoutDuplicates(cc: string[], to: string[]): string[] {
  const main = new Set(to.map((address) => address.toLowerCase()));
  return cc.filter((address) => !main.has(address.toLowerCase()));
}

/** Confirms the caller is signed in and permitted to send. Never trusts the browser. */
export async function authoriseSender(request: Request): Promise<SenderIdentity | { error: string }> {
  const caller = await signedInEmail(request);
  if ("error" in caller) return caller;
  if (!ALLOWED_SENDERS.includes(caller.email)) return { error: "You are not permitted to send to clients." };
  return { email: caller.email };
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

export type MailOptions = {
  to: string[];
  /** Copied, not addressed: the office that files it, the colleague who asked. */
  cc?: string[];
  replyTo: string;
  subject: string;
  body: string;
  attachments: GraphAttachment[];
};

const mailboxUrl = (mailbox: string) =>
  `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}`;

/** The message without its files - the same words whichever way it goes out. */
function messageBody(options: MailOptions) {
  return {
    subject: options.subject,
    body: { contentType: "Text", content: options.body },
    toRecipients: options.to.map((address) => ({ emailAddress: { address } })),
    ...(options.cc?.length
      ? { ccRecipients: options.cc.map((address) => ({ emailAddress: { address } })) }
      : {}),
    replyTo: [{ emailAddress: { address: options.replyTo } }]
  };
}

/** What a file weighs before base64 made it a third bigger. */
function rawBytes(attachment: GraphAttachment) {
  const encoded = attachment.contentBytes;
  const padding = encoded.endsWith("==") ? 2 : encoded.endsWith("=") ? 1 : 0;
  return Math.floor((encoded.length * 3) / 4) - padding;
}

/**
 * Sends the mail, choosing the way out by what it is carrying.
 *
 * The caller passes the same thing either way. One certificate still leaves
 * the lab on a single call to Graph; it is only a batch too big for that
 * which takes the longer road.
 */
export async function sendMail(options: MailOptions) {
  const mailbox = process.env.MS_SENDER_MAILBOX || "njoftime@sarpandlab.al";
  const token = await getGraphToken();
  const total = options.attachments.reduce((sum, attachment) => sum + rawBytes(attachment), 0);
  if (total <= INLINE_TOTAL_BYTES) await sendInOneRequest(mailbox, token, options);
  else await sendThroughDraft(mailbox, token, options);
  return { mailbox };
}

/** Everything in one POST. Graph refuses a body over ~4 MB, hence the other path. */
async function sendInOneRequest(mailbox: string, token: string, options: MailOptions) {
  const response = await fetch(`${mailboxUrl(mailbox)}/sendMail`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: { ...messageBody(options), attachments: options.attachments },
      saveToSentItems: "true"
    })
  });
  if (!response.ok) {
    throw new Error(`Graph rejected the send (${response.status}): ${await response.text()}`);
  }
}

/**
 * Writes the mail as a draft, uploads the files into it, then sends it.
 *
 * This is the only route Graph gives for attachments past the request limit,
 * and it needs the Mail.ReadWrite application permission as well as Mail.Send,
 * both scoped to njoftime@ by the same access policy. Without it the draft is
 * refused, and the message below says what to grant rather than a bare 403.
 */
async function sendThroughDraft(mailbox: string, token: string, options: MailOptions) {
  const draftResponse = await fetch(`${mailboxUrl(mailbox)}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(messageBody(options))
  });
  if (draftResponse.status === 403) {
    throw new Error(
      "A batch this large has to be built as a draft, and Graph refused: the app " +
        "registration needs the Mail.ReadWrite application permission (admin " +
        "consented, scoped to the sending mailbox) on top of Mail.Send. Until that " +
        "is granted, send them in batches under 2.8 MB."
    );
  }
  if (!draftResponse.ok) {
    throw new Error(`Graph would not open a draft (${draftResponse.status}): ${await draftResponse.text()}`);
  }
  const draft = (await draftResponse.json()) as { id?: string };
  if (!draft.id) throw new Error("Graph opened a draft without an id.");
  const draftId = draft.id;

  try {
    for (const attachment of options.attachments) {
      await uploadAttachment(mailbox, token, draftId, attachment);
    }
    const sent = await fetch(`${mailboxUrl(mailbox)}/messages/${draftId}/send`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!sent.ok) throw new Error(`Graph rejected the send (${sent.status}): ${await sent.text()}`);
  } catch (error) {
    // Nobody reads njoftime@, so a half-built mail left in its Drafts would sit
    // there unseen and unsent. Take it back out before reporting the failure.
    await fetch(`${mailboxUrl(mailbox)}/messages/${draftId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {});
    throw error;
  }
}

/** One file into an open draft, 3.2 MB at a time, as Graph requires. */
async function uploadAttachment(
  mailbox: string,
  token: string,
  messageId: string,
  attachment: GraphAttachment
) {
  const content = Buffer.from(attachment.contentBytes, "base64");
  const session = await fetch(`${mailboxUrl(mailbox)}/messages/${messageId}/attachments/createUploadSession`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      AttachmentItem: {
        attachmentType: "file",
        name: attachment.name,
        size: content.byteLength,
        contentType: attachment.contentType
      }
    })
  });
  if (!session.ok) {
    throw new Error(`Graph would not take ${attachment.name} (${session.status}): ${await session.text()}`);
  }
  const { uploadUrl } = (await session.json()) as { uploadUrl?: string };
  if (!uploadUrl) throw new Error(`Graph gave no upload address for ${attachment.name}.`);

  for (let start = 0; start < content.byteLength; start += UPLOAD_CHUNK_BYTES) {
    const end = Math.min(start + UPLOAD_CHUNK_BYTES, content.byteLength) - 1;
    // No Authorization here: the upload address carries its own, and Graph
    // turns the request away if a bearer token is sent with it as well.
    const put = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Range": `bytes ${start}-${end}/${content.byteLength}` },
      body: content.subarray(start, end + 1)
    });
    if (!put.ok) {
      throw new Error(`${attachment.name} stopped uploading at ${start} (${put.status}): ${await put.text()}`);
    }
  }
}
