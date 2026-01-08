export function formatCurrencyUSD(value: number): string {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
export function formatCompact(value: number): string {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return '0';
  }
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);
}
export function formatPct(value: number): string {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return '0.00%';
  }
  const formatted = value.toFixed(2);
  // Ensure we don't show +0.00% or -0.00% for values effectively at zero
  const isEffectivelyZero = Math.abs(value) < 0.005;
  if (isEffectivelyZero) {
    return '0.00%';
  }
  return `${value > 0 ? '+' : ''}${formatted}%`;
}