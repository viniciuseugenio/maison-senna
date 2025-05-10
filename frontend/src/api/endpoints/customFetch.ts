import { UNEXPECTED_ERROR } from "./constants";

export async function customFetch(
  url: string,
  options?: Record<string, unknown>,
  ignore400?: boolean,
) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400 && ignore400) {
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
