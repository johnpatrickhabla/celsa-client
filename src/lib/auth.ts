import { jwtDecode } from "jwt-decode";

export type Role = "admin" | "staff" | "customer";

export interface CelsaJwtPayload {
  sub: string; // user id
  role: Role;
  name: string;
  email: string;
  exp: number;
}

/**
 * Decodes the access token stored client-side.
 * The backend (Express) is the source of truth for auth — this only reads
 * the token so the frontend can show/hide UI. Every real permission check
 * still happens again on the Express route via RBAC middleware.
 */
export function decodeToken(token: string | null | undefined): CelsaJwtPayload | null {
  if (!token) return null;
  try {
    const payload = jwtDecode<CelsaJwtPayload>(token);
    if (payload.exp * 1000 < Date.now()) return null; // expired
    return payload;
  } catch {
    return null;
  }
}

export function hasRole(payload: CelsaJwtPayload | null, allowed: Role[]): boolean {
  if (!payload) return false;
  return allowed.includes(payload.role);
}

export const ROLE_HOME: Record<Role, string> = {
  admin: "/admin/dashboard",
  staff: "/staff/dashboard",
  customer: "/",
};
