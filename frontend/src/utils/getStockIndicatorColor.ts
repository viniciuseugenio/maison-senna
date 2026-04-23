export function getStockIndicatorColor(
  stock: number,
  prefix: "bg" | "text" = "bg",
) {
  let level: "critical" | "low" | "normal" = "normal";
  const colors = {
    bg: {
      critical: "bg-red-600",
      low: "bg-yellow-500",
      normal: "bg-green-600",
    },
    text: {
      critical: "text-red-600",
      low: "text-yellow-500",
      normal: "text-green-600",
    },
  };

  if (stock < 20) {
    level = "critical";
  } else if (stock <= 30) {
    level = "low";
  }

  return colors[prefix][level];
}
