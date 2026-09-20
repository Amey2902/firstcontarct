/**
 * Frontend contract definitions, constants, and cryptographic helper utilities.
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

export const COMPLIANCE_OUTCOME = {
  NON_COMPLIANT: 0,
  COMPLIANT: 1,
} as const;

export function licenseTypeName(type: number): string {
  return LICENSE_TYPE_NAMES[type] ?? `Unknown(${type})`;
}

export function authStatusName(status: number): string {
  return AUTH_STATUS_NAMES[status] ?? `Unknown(${status})`;
}

export async function sha256HexBrowser(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function computeDatasetIdBrowser(owner: string, name: string): Promise<string> {
  return sha256HexBrowser(`dataset:${owner}:${name}`);
}

export async function computeCommitmentIdBrowser(trainer: string, model: string): Promise<string> {
  return sha256HexBrowser(`commitment:${trainer}:${model}`);
}

export async function computeVerificationIdBrowser(commitmentId: string, timestamp: number): Promise<string> {
  return sha256HexBrowser(`verification:${commitmentId}:${timestamp}`);
}

export async function computeModelHashBrowser(modelName: string, architecture: string): Promise<string> {
  return sha256HexBrowser(`model:${modelName}:${architecture}`);
}

