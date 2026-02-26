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
export declare function isAppError(error: unknown): error is AppError;
//# sourceMappingURL=api-error.d.ts.map
