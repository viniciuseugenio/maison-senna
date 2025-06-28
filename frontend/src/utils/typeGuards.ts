import { ApiFormError, ApiResponse } from "../types/api";

export function isApiFormError(
  data: ApiFormError | ApiResponse,
): data is ApiFormError {
  return "errors" in data;
}
