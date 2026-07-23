import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except the Payload admin/API, the health endpoint,
  // Next internals, and static files. `admin`/`api` are owned by Payload (the
  // (payload) route group) and `health` is an unlocalized route handler — none
  // may be locale-prefixed.
  matcher: ["/((?!api|admin|health|_next|_vercel|.*\\..*).*)"],
};
