import type { Where } from "payload";
import { isResponse, json, requireStaff } from "@/agent/auth";

export const dynamic = "force-dynamic";

/** Conversation list with filters: channel, status, mode, assignee, unread, needs-human, search. */
export async function GET(req: Request) {
  const staff = await requireStaff(req);
  if (isResponse(staff)) return staff;
  const sp = new URL(req.url).searchParams;
  const and: Where[] = [];
  const eq = (field: string, v: string | null) => v && v !== "all" && and.push({ [field]: { equals: v } });
  eq("channel", sp.get("channel"));
  eq("status", sp.get("status"));
  eq("aiMode", sp.get("mode"));
  eq("assignedTeam", sp.get("team"));
  const assigned = sp.get("assigned");
  if (assigned === "me") and.push({ assignedTo: { equals: staff.user.id } });
  else if (assigned === "none") and.push({ assignedTo: { exists: false } });
  else if (assigned && assigned !== "all") and.push({ assignedTo: { equals: Number(assigned) } });
  if (sp.get("unread") === "1") and.push({ unreadCount: { greater_than: 0 } });
  if (sp.get("needsHuman") === "1") and.push({ needsHuman: { equals: true } });
  const q = sp.get("q")?.trim();
  if (q) and.push({ or: [{ customerName: { like: q } }, { lastMessagePreview: { like: q } }, { customerExternalId: { like: q } }] });

  const page = Math.max(1, Number(sp.get("page")) || 1);
  const r = await staff.payload.find({
    collection: "conversations",
    where: and.length ? { and } : undefined,
    sort: "-lastMessageAt",
    limit: 40,
    page,
    depth: 1,
    overrideAccess: true,
  });
  return json(200, {
    totalDocs: r.totalDocs,
    hasNextPage: r.hasNextPage,
    docs: r.docs.map((c) => ({
      id: c.id,
      channel: c.channel,
      customerName: c.customerName,
      status: c.status,
      aiMode: c.aiMode,
      needsHuman: c.needsHuman,
      unreadCount: c.unreadCount ?? 0,
      lastMessageAt: c.lastMessageAt,
      lastMessagePreview: c.lastMessagePreview,
      assignedTeam: c.assignedTeam,
      assignedTo: typeof c.assignedTo === "object" && c.assignedTo ? { id: c.assignedTo.id, name: c.assignedTo.name ?? c.assignedTo.email } : null,
    })),
  });
}
