import { computeAnalytics } from "@/agent/analytics";
import { isResponse, json, requireStaff } from "@/agent/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const staff = await requireStaff(req);
  if (isResponse(staff)) return staff;
  const days = Math.min(365, Math.max(1, Number(new URL(req.url).searchParams.get("days")) || 30));
  return json(200, await computeAnalytics(staff.payload, days));
}
