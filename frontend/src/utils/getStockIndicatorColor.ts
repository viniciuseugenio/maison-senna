export function getStockIndicatorColor(stock: number, prefix: string = "bg") {
  let color = `${prefix}-green-600`;

  if (stock < 20) {
    color = `${prefix}-red-600`;
  } else if (stock <= 30) {
    color = `${prefix}-yellow-500`;
  }

  return color;
}
