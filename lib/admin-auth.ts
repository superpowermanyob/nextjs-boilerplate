import "server-only";

import { NextRequest } from "next/server";

export const ADMIN_BANNER_SECRET = "my_secret_admin_key_123";

export function isAdminBannerAuthorized(request: NextRequest): boolean {
  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${ADMIN_BANNER_SECRET}`;
}

export function getAdminAuthErrorMessage(): string {
  return "Invalid admin credentials.";
}
