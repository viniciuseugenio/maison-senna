export function formatPrice(value: number | string): string {
  // Ensure the value is a number
  const price = Number(value);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}
