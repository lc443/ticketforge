import { HttpErrorResponse } from '@angular/common/http';

export interface ApiErrorBody {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
}

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse)) return fallback;

  const body = error.error as ApiErrorBody | string | null;
  if (typeof body === 'object' && body?.message) return body.message;
  if (typeof body === 'string' && body.trim()) return body;

  if (error.status === 0) return 'Could not reach the backend.';
  return error.statusText
    ? `${error.status} ${error.statusText}`
    : fallback;
}
