import { AUTH_ENDPOINTS, UNEXPECTED_ERROR } from "./constants";

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
  returnBadRequest?: boolean;
  _isRetry?: boolean;
}

export async function customFetch<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  try {
    const {
      requiresAuth = false,
      returnBadRequest = false,
      _isRetry = false,
      ...fetchOptions
    } = options;

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

    const response = await fetch(url, config);

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
        throw new Error("User must be authenticated");
      }
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400 && returnBadRequest) {
        return { errors: data, status: response.status };
      }
      throw {
        title: data.detail || UNEXPECTED_ERROR,
        description: data.description,
        status: response.status,
      };
    }

    return data;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "title" in error &&
      typeof error.title === "string"
    ) {
      throw error;
    }

    throw {
      title: UNEXPECTED_ERROR,
      status: 500,
    };
  }
}
