import { useVariationWarning } from "./useVariationWarning";

type UseWarningGuard = {
  onConfirm: () => void;
  onCancel?: () => void;
  shouldWarn: boolean;
};

export const useWarningGuard = () => {
  const { setShowWarning, callbackRefs } = useVariationWarning();

  return ({ onConfirm, onCancel, shouldWarn }: UseWarningGuard) => {
    if (shouldWarn) {
      setShowWarning(true);
      callbackRefs.current = {
        onConfirm,
        onCancel,
      };
    } else {
      onConfirm();
    }
  };
};
