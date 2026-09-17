/**
 * Putting the weekly backup into SharePoint.
 *
 * The emailed copy already survives the database being lost, but it lives in
 * one inbox and can be deleted by accident. SharePoint is where the lab already
 * keeps its records, it is backed by Microsoft's own retention, and it gives
 * every file version history for free — so a backup overwritten by a bad one is
 * still recoverable.
 *
 * The site is resolved from its path rather than a stored id, so this keeps
 * working if the site is ever re-provisioned, and the path is readable to
 * whoever comes to this next.
 */
export type SharePointUploadResult =
  | { status: "uploaded"; webUrl?: string; folder: string; fileName: string }
  | { status: "not-permitted"; detail: string }
  | { status: "failed"; detail: string };

const GRAPH = "https://graph.microsoft.com/v1.0";

function config() {
  return {
    hostname: process.env.SHAREPOINT_HOSTNAME || "sarpandlab.sharepoint.com",
    sitePath: process.env.SHAREPOINT_SITE_PATH || "LaboratoriMaterialeve2026",
    folder: process.env.SHAREPOINT_BACKUP_FOLDER || "10. Backup Aplikacioni"
  };
}

async function graph(token: string, url: string, init?: RequestInit) {
  return fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init?.headers ?? {}) }
  });
}

/**
 * Uploads one file into the lab site's document library.
 *
 * Never throws: the caller has already taken the database snapshot and still
 * has an email to send, and a SharePoint outage must not cost us those. The
 * outcome is returned so the email can report it — which is what turns this
 * into something that tells you when it has stopped working.
 */
export async function uploadBackupToSharePoint(params: {
  token: string;
  fileName: string;
  contentType: string;
  content: Buffer;
}): Promise<SharePointUploadResult> {
  const { hostname, sitePath, folder } = config();
  const { token, fileName, contentType, content } = params;

  try {
    const siteResponse = await graph(token, `${GRAPH}/sites/${hostname}:/sites/${encodeURIComponent(sitePath)}`);
    if (!siteResponse.ok) {
      const detail = `site lookup ${siteResponse.status}: ${await siteResponse.text()}`;
      // 401/403 here means the app registration has no Sites permission yet,
      // which is a setup step rather than a fault — worth saying differently.
      return siteResponse.status === 401 || siteResponse.status === 403
        ? { status: "not-permitted", detail }
        : { status: "failed", detail };
    }
    const siteId = ((await siteResponse.json()) as { id: string }).id;

    const driveResponse = await graph(token, `${GRAPH}/sites/${siteId}/drive`);
    if (!driveResponse.ok) {
      return { status: "failed", detail: `drive lookup ${driveResponse.status}: ${await driveResponse.text()}` };
    }
    const driveId = ((await driveResponse.json()) as { id: string }).id;

    // Create the destination folder if it is not there. 409 means someone (or
    // last week's run) already made it, which is success as far as we care.
    const folderResponse = await graph(token, `${GRAPH}/drives/${driveId}/root/children`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: folder,
        folder: {},
        "@microsoft.graph.conflictBehavior": "fail"
      })
    });
    if (!folderResponse.ok && folderResponse.status !== 409) {
      const detail = `folder create ${folderResponse.status}: ${await folderResponse.text()}`;
      return folderResponse.status === 403 ? { status: "not-permitted", detail } : { status: "failed", detail };
    }

    const path = `${folder}/${fileName}`;
    const uploadResponse = await graph(
      token,
      `${GRAPH}/drives/${driveId}/root:/${encodeURIComponent(folder)}/${encodeURIComponent(fileName)}:/content`,
      { method: "PUT", headers: { "Content-Type": contentType }, body: new Uint8Array(content) }
    );
    if (!uploadResponse.ok) {
      const detail = `upload ${uploadResponse.status}: ${await uploadResponse.text()}`;
      return uploadResponse.status === 403 ? { status: "not-permitted", detail } : { status: "failed", detail };
    }

    const item = (await uploadResponse.json()) as { webUrl?: string };
    return { status: "uploaded", webUrl: item.webUrl, folder: path, fileName };
  } catch (error) {
    return { status: "failed", detail: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Read-only check that the app registration can actually see the lab site.
 *
 * This is what makes the dry run useful straight after granting the permission
 * in Azure: it answers "is it wired up yet" without writing anything, so nobody
 * has to wait until Sunday to find out.
 */
export async function probeSharePointAccess(token: string) {
  const { hostname, sitePath, folder } = config();
  const target = { site: `${hostname}/sites/${sitePath}`, folder };
  try {
    const response = await graph(token, `${GRAPH}/sites/${hostname}:/sites/${encodeURIComponent(sitePath)}`);
    if (response.ok) {
      const site = (await response.json()) as { displayName?: string };
      return { ...target, reachable: true, siteName: site.displayName };
    }
    return {
      ...target,
      reachable: false,
      status: response.status,
      hint:
        response.status === 401 || response.status === 403
          ? "Permission not granted yet — see the Azure steps."
          : "Unexpected response from Microsoft Graph."
    };
  } catch (error) {
    return { ...target, reachable: false, hint: error instanceof Error ? error.message : String(error) };
  }
}

/** One line for the backup email, so a silent failure cannot stay silent. */
export function sharePointStatusLine(result: SharePointUploadResult) {
  if (result.status === "uploaded") {
    return `Kopje në SharePoint: <strong>${result.folder}</strong><br /><span style="color:#6b7280;">SharePoint copy saved.</span>`;
  }
  if (result.status === "not-permitted") {
    return (
      `Kopja në SharePoint nuk u ruajt — leja nuk është dhënë ende.<br />` +
      `<span style="color:#6b7280;">SharePoint copy skipped: the app registration does not have permission to the lab site yet. ` +
      `This email and the database snapshot are unaffected.</span>`
    );
  }
  return (
    `Kopja në SharePoint dështoi.<br />` +
    `<span style="color:#6b7280;">SharePoint copy failed: ${result.detail}. This email and the database snapshot are unaffected.</span>`
  );
}
