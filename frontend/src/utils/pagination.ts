import { PAGE_SIZE } from "@/api/constants";

export function calcPageSizeAndQty(
  resultsLength: number = 0,
  count: number = 0,
) {
  const pageSize = Math.max(PAGE_SIZE, resultsLength);
  const qtyPages = Math.ceil(count / pageSize);
  return { pageSize, qtyPages };
}
