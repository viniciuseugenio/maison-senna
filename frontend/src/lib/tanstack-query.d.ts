import type { FetchErrorType } from "../types/api";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: FetchErrorType;
  }
}
