import { createContext } from "react";
import { Option } from "@/types";

export type VariationDataType = {
  index: number;
  updater: (prev: Option[]) => Option[];
};

export type WarnModalStateType =
  | { isOpen: false }
  | {
      isOpen: true;
      onConfirm: () => void;
      onCancel?: () => void;
      resolve?: (value: boolean | PromiseLike<boolean>) => void;
      reject?: (reason?: any) => void;
    };

export const VariationWarningContext = createContext<
  | {
      skipVariationWarnings: boolean;
      setSkipVariationWarnings: React.Dispatch<React.SetStateAction<boolean>>;
      warnModalState: WarnModalStateType;
      setWarnModalState: React.Dispatch<
        React.SetStateAction<WarnModalStateType>
      >;
    }
  | undefined
>(undefined);
