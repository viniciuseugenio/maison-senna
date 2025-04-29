import { UNEXPECTED_ERROR } from "./constants";

export async function customFetch(
  url: string,
  ignore400?: boolean,
  options?: Record<string, unknown>,
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
      throw new Error(data.detail);
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || UNEXPECTED_ERROR);
    }

    throw new Error(UNEXPECTED_ERROR);
  }
}
