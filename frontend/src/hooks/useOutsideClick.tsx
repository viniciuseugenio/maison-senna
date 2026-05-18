import { useEffect } from "react";

export const useOutsideClick = (
  isOpen: boolean,
  action: () => void,
  ref: React.RefObject<HTMLDivElement | null>,
) => {
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as Node;
      const notificationEl = document.getElementById("toast-notification");

      const clickedRef = !!ref.current && ref.current.contains(target);
      const clickedNotification =
        !!notificationEl && notificationEl.contains(target);

      if (!clickedRef && !clickedNotification) {
        action();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });
};
