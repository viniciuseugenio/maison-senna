import { toastMessages } from "@/constants/auth";
import { AUTH_ENDPOINTS } from "@/api/constants";
import { QuerySetOptions } from "@/types";

export class FetchError extends Error {
  public readonly status: number;
  public readonly detail: string;
  public readonly description?: string;
  public readonly errors?: Record<string, string[]>;

  constructor(
    status: number,
    detail: string,
    description?: string,
    errors?: Record<string, string[]>,
  ) {
    super(detail);
    this.name = "FetchError";
    this.status = status;
    this.detail = detail;
    this.description = description;
    this.errors = errors;
  }
}

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
  returnBadRequest?: boolean;
  _isRetry?: boolean;
  queryParams?: QuerySetOptions;
}

export async function customFetch<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const search = new URLSearchParams();

  const {
    requiresAuth = false,
    _isRetry = false,
    queryParams,
    ...fetchOptions
  } = options;

  const page = queryParams?.page;
  const max_results = queryParams?.max_results;
  const limit = queryParams?.limit;

  if (page !== undefined) search.set("page", String(page));
  if (max_results !== undefined) search.set("max_results", String(max_results));
  if (limit !== undefined) search.set("limit", String(limit));
  const query = search.toString();
  const urlWithQuery = query ? `${url}?${query}` : url;

  const config: RequestInit = {
    headers: {
      ...(!(fetchOptions.body instanceof FormData) && {
        "Content-Type": "application/json",
      }),
      ...fetchOptions.headers,
    },
    credentials: "include",
    ...fetchOptions,
  };

  const response = await fetch(urlWithQuery, config);

  if (response.status === 401 && requiresAuth && !_isRetry) {
    const refresh = await fetch(AUTH_ENDPOINTS.REFRESH_ACCESS_TOKEN, {
      method: "POST",
      credentials: "include",
    });

    if (refresh.ok) {
      return await customFetch(url, {
        ...options,
        credentials: "include",
        _isRetry: true,
      });
    } else {
      throw new FetchError(response.status, "Authentication refresh failed!");
    }
  }

  if (response.status === 204) return undefined as T;

  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (response.status === 400) {
      throw new FetchError(
        response.status,
        data.detail ?? toastMessages.formSubmissionFailed.title,
        data.description ?? toastMessages.formSubmissionFailed.description,
        data,
      );
    }

    throw new FetchError(
      response.status,
      data.detail,
      data.description,
      data.errors,
    );
  }

  return data;
}
