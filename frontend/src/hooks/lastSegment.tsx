import { useLocation } from "react-router";

export default function useLastSegment() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  return segments[segments.length - 1] || "";
}
