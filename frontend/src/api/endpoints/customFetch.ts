import { camelCase } from "change-case";
import { transformKeys } from "../../utils/transformKeys";
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
    let data = response;

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

    const camelData = transformKeys(data, camelCase);
    if (!response.ok) {
      if (response.status === 400 && additionalOptions?.ignore400Response) {
        return { errors: camelData, status: response.status };
      }
      throw {
        title: camelData.detail || UNEXPECTED_ERROR,
        description: camelData.description,
        status: response.status,
      };
    }

    return camelData;
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
