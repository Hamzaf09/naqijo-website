import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except the Payload admin/API, Next internals, and
  // static files. `admin` and `api` are owned by Payload (the (payload) route
  // group) and must never be locale-prefixed.
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
