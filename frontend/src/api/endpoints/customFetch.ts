import { AUTH_ENDPOINTS, UNEXPECTED_ERROR } from "./constants";

export async function customFetch(
  url: string,
  options?: RequestInit,
  additionalOptions?: {
    ignore400Response?: boolean;
    noContent?: boolean;
    _isRetry?: boolean;
  },
) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
    });

    if (response.status === 401 && !additionalOptions?._isRetry) {
      const refresh = await fetch(AUTH_ENDPOINTS.REFRESH_ACCESS_TOKEN, {
        method: "POST",
      });

      if (refresh.ok) {
        return await customFetch(url, {
          ...options,
          credentials: "include",
        });
      } else {
        throw new Error("User must be authenticated");
      }
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400 && additionalOptions?.ignore400Response) {
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
