export type ApiResponseType = {
  detail: string;
  description?: string;
  [key: string]: unknown;
};

export type FetchErrorType = {
  detail: string;
  description?: string;
  status: number;
  errors?: Record<string, string[]>;
};

export interface QuerySetOptions {
  limit?: number;
  max_results?: number;
  page?: number;
  search?: string;
}
