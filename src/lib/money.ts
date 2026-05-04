export function formatMoney(value: number, currencySymbol = "₹") {
  return `${currencySymbol}${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function parseMoneyInput(value: string) {
  const normalized = value.replace(/,/g, "").trim();
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : Number.NaN;
}
