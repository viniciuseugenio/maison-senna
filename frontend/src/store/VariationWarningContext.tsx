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

export type WarnModalStateType = boolean;

export const VariationWarningContext = createContext<
  | {
      skipVariationWarnings: boolean;
      setSkipVariationWarnings: React.Dispatch<React.SetStateAction<boolean>>;
      showWarning: WarnModalStateType;
      setShowWarning: React.Dispatch<React.SetStateAction<WarnModalStateType>>;
      callbackRefs: RefObject<CallbackRefs>;
    }
  | undefined
>(undefined);
