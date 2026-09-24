export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  metadata?: {
    total?: number;
    page?: number;
    pageSize?: number;
    executionTimeMs?: number;
  };
}