import "server-only";

import { NextRequest } from "next/server";

export function isAdminBannerAuthorized(request: NextRequest): boolean {
  const secret = process.env.ADMIN_BANNER_SECRET?.trim();
  if (!secret) {
    return false;
  }

  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${secret}`;
}

export function getAdminAuthErrorMessage(): string {
  if (!process.env.ADMIN_BANNER_SECRET?.trim()) {
    return "ADMIN_BANNER_SECRET is not configured on the server.";
  }

  return "Invalid admin credentials.";
}
