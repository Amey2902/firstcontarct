/**
 * Shared constants for the BlackBox AI contract.
 * Used by both the Node CLI/tests and the frontend (via re-export in frontend/src/contract.ts).
 */

export const LICENSE_TYPES = {
  COMMERCIAL: 0,
  OPEN_SOURCE: 1,
  PROPRIETARY: 2,
  RESTRICTED: 3,
} as const;

export const LICENSE_TYPE_NAMES = ['Commercial', 'Open Source', 'Proprietary', 'Restricted'] as const;

export const AUTH_STATUS = {
  PENDING: 0,
  AUTHORIZED: 1,
  REVOKED: 2,
  EXPIRED: 3,
} as const;

export const AUTH_STATUS_NAMES = ['Pending', 'Authorized', 'Revoked', 'Expired'] as const;

export function licenseTypeName(type: number): string {
  return LICENSE_TYPE_NAMES[type] ?? `Unknown(${type})`;
}

export function authStatusName(status: number): string {
  return AUTH_STATUS_NAMES[status] ?? `Unknown(${status})`;
}
