/**
 * Standardized API error interface.
 * All API errors are normalized to this shape.
 */
export interface AppError {
  code: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'statusCode' in error
  );
}
