import { camelCase } from "change-case";
import { transformKeys } from "../../utils/transformKeys";
import { UNEXPECTED_ERROR } from "./constants";

export async function customFetch(
  url: string,
  options?: RequestInit,
  additionalOptions?: {
    ignore400Response?: boolean;
  },
) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
    });

    const data = await response.json();
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
