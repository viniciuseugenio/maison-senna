import { createContext, RefObject } from "react";
import { Option } from "@/types";

export type VariationDataType = {
  index: number;
  updater: (prev: Option[]) => Option[];
};

export type CallbackRefs = {
  onConfirm: () => void;
  onCancel?: () => void;
};

export const VariationWarningContext = createContext<
  | {
      skipVariationWarnings: boolean;
      setSkipVariationWarnings: React.Dispatch<React.SetStateAction<boolean>>;
      showWarning: boolean;
      setShowWarning: React.Dispatch<React.SetStateAction<boolean>>;
      callbackRefs: RefObject<CallbackRefs>;
    }
  | undefined
>(undefined);
