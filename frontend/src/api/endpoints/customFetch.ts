import { UNEXPECTED_ERROR } from "./constants";
import humps from "humps";

export async function customFetch(
  url: string,
  options?: RequestInit,
  ignore400?: boolean,
) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
    });
    const data = await response.json();
    const camelData = humps.camelizeKeys(data);

    if (!response.ok) {
      if (response.status === 400 && ignore400) {
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
