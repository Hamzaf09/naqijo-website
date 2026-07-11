import type { Access, FieldAccess } from "payload";

/** Only signed-in CMS users may perform the operation. */
export const authenticated: Access = ({ req }) => Boolean(req.user);

/** Field-level variant of {@link authenticated}. */
export const authenticatedField: FieldAccess = ({ req }) => Boolean(req.user);

/** Public read — the frontend reads published content anonymously. */
export const anyone: Access = () => true;
