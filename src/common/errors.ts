import type { HTTPError } from 'ky';
import type { FieldPath, UseFormSetError } from 'react-hook-form';

export class MfaRequiredError extends Error {
  constructor(message = 'MFA verification required') {
    super(message);
    this.name = 'MfaRequiredError';
  }
}

type ValidationErrorResponse = {
  error: string;
  details: Array<{
    field: string;
    message: string;
  }>;
};

export async function handleApiFieldErrors<T extends Record<string, unknown>>(
  error: HTTPError,
  setError: UseFormSetError<T>
): Promise<boolean> {
  if (error.response.status === 400) {
    try {
      const errorData =
        (await error.response.json()) as ValidationErrorResponse;
      if (errorData.error === 'Validation failed' && errorData.details) {
        for (const detail of errorData.details) {
          setError(detail.field as FieldPath<T>, {
            type: 'manual',
            message: detail.message,
          });
        }
        return true;
      }
    } catch {
      // Failed to parse error response
    }
  }
  return false;
}
