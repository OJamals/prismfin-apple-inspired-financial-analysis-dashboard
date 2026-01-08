export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type TimeRange = '1M' | '3M' | '6M' | '1Y';
export type TradingMode = 'live' | 'paper';
export type AssetClass = 'all' | 'equity' | 'crypto' | 'fixed-income';
export interface SeriesPoint {
  label: string;
  value: number;
}
export interface Kpi {
  id: string;
  label: string;
  value: number;
  deltaPct: number;
}
export type AlertPriority = 'high' | 'medium' | 'low';
export interface Alert {
  id: string;
  type: string;
  message: string;
  priority: AlertPriority;
  timestamp: number;
  assetSymbol?: string;
}
export interface MetricsRow {
  name: string;
  symbol: string;
  price: number;
  changePct: number;
  ytdPct: number;
  volume: string;
  class: AssetClass;
  sentiment: number; // 0-100
  peRatio?: number;
  rsi?: number;
  miniSeries: SeriesPoint[];
}
export interface DashboardData {
  range: TimeRange;
  mode: TradingMode;
  updatedAt: number;
  kpis: Kpi[];
  performance: SeriesPoint[];
  cashflow: SeriesPoint[];
  rows: MetricsRow[];
  alerts: Alert[];
}
export interface MonteCarloSeriesPoint {
  label: string;
  p10: number;
  median: number;
  p90: number;
}
export interface MonteCarloStats {
  horizon: '1Y' | '5Y' | '10Y';
  p10: number;
  median: number;
  p90: number;
  series: MonteCarloSeriesPoint[];
}
export interface FactorAttribution {
  label: string;
  value: number;
  color: string;
}
export interface RiskRewardPoint {
  symbol: string;
  returns: number;
  volatility: number;
  sharpe: number;
  weight: number;
}
export interface DrawdownPoint {
  label: string;
  value: number;
  drawdownPct: number;
}
export interface DrawdownData {
  maxDrawdown: number;
  series: DrawdownPoint[];
}
export interface CorrelationData {
  symbols: string[];
  matrix: Record<string, Record<string, number>>;
}
export interface QuantData {
  range: TimeRange;
  mode: TradingMode;
  updatedAt: number;
  portfolio: SeriesPoint[];
  benchmark: SeriesPoint[];
  factors: FactorAttribution[];
  monteCarlo: Record<'1Y' | '5Y' | '10Y', MonteCarloStats>;
  riskReward: RiskRewardPoint[];
  drawdown: DrawdownData;
  correlation: CorrelationData;
}