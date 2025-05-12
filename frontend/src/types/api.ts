export type ApiResponse = {
  detail: string;
  description?: string;
  [key: string]: unknown;
};

export type ApiError = {
  name: "ApiError";
  title: string;
  description?: string;
  status: number;
};
