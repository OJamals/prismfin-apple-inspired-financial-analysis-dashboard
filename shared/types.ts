export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type TimeRange = '1M' | '3M' | '6M' | '1Y';
export type AssetClass = 'all' | 'equity' | 'crypto' | 'fixed-income';
export type DensityMode = 'comfortable' | 'compact';
export type SkillLevel = 'novice' | 'pro' | 'institutional';
export type TradingMode = 'live' | 'paper';
export interface SeriesPoint {
  label: string;
  value: number;
}
export interface Kpi {
  id: string;
  label: string;
  value: number;
  deltaPct: number;
  isWarning?: boolean;
}
export interface PulseMetric {
  summary: string;
  detail: string;
  health: 'healthy' | 'warning';
  comparisonLabel: string;
}
export interface HoldingsMetrics {
  diversificationPct: number;
  diversificationLabel: string;
  riskLevel: 'Conservative' | 'Moderate' | 'Aggressive';
  beta: number;
  yieldPct: number;
  yieldLabel: string;
}
export type AlertPriority = 'high' | 'medium' | 'low';
export type AlertType = 'volatility' | 'info' | 'technical' | 'sentiment';
export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  priority: AlertPriority;
  timestamp: number;
  assetSymbol?: string;
}
export interface NewsHeadline {
  headline: string;
  score: number; // 0-100
}
export interface MetricsRow {
  name: string;
  symbol: string;
  price: number;
  changePct: number;
  ytdPct: number;
  volume: string;
  class: AssetClass;
  sentiment: number;
  sector?: string;
  peRatio?: number;
  rsi?: number;
  miniSeries: SeriesPoint[];
  news?: NewsHeadline[];
  tags?: string[];
  isImproving?: boolean;
}
export interface DashboardData {
  range: TimeRange;
  mode: TradingMode;
  updatedAt: number;
  kpis: Kpi[];
  holdingsMetrics: HoldingsMetrics;
  performance: SeriesPoint[];
  benchmarkPerformance: SeriesPoint[];
  monthlyReturns: SeriesPoint[];
  topMovers: MetricsRow[];
  cashflow: SeriesPoint[];
  rows: MetricsRow[];
  alerts: Alert[];
  sectors: Record<string, number>;
  riskReward: RiskRewardPoint[];
  pulse: PulseMetric;
}
export interface SimScenario {
  marketStress: number; // -20 to 20
  adjustmentPct: number;
}
export interface QuantInsight {
  summary: string;
  attribution: string;
  riskExposure: string;
  recommendation: string;
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
  insight: QuantInsight;
  portfolio: SeriesPoint[];
  benchmark: SeriesPoint[];
  factors: FactorAttribution[];
  monteCarlo: Record<'1Y' | '5Y' | '10Y', MonteCarloStats>;
  riskReward: RiskRewardPoint[];
  drawdown: DrawdownData;
  correlation: CorrelationData;
  pulse: PulseMetric;
}
export type SentimentCategory = 'Bullish' | 'Neutral' | 'Bearish';
export interface ScreenerStock {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  peRatio: number;
  pegRatio: number;
  yieldPct: number;
  marketCap: string;
  volatility: number;
  sharpe: number;
  beta: number;
  sector: string;
  sentiment: SentimentCategory;
  miniSeries: SeriesPoint[];
}
export interface ScreenerPreset {
  id: string;
  label: string;
  filters: Partial<ScreenerFilters>;
}
export interface ScreenerFilters {
  pe: number[];
  yield: number[];
  sharpe: number[];
  peg: number[];
  beta: number[];
  sector: string;
  sentiment: string;
  volatilityThreshold?: number;
  crossoverThreshold?: number;
}
export interface SentimentArticle {
  id: string;
  source: string;
  headline: string;
  summary: string;
  timestamp: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  url: string;
}
export interface SentimentOverview {
  symbol: string;
  overallScore: number; // 0-100
  mentions24h: number;
  trend: 'improving' | 'declining' | 'stable';
  articles: SentimentArticle[];
}
export type AcademyDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type AcademyStepType = 'content' | 'video' | 'interactive' | 'quiz' | 'diagram';
export interface AcademyStep {
  id: string;
  title: string;
  type: AcademyStepType;
  content: string;
  formula?: string;
  interactiveType?: 'sharpe-calc' | 'monte-carlo-sim' | 'corr-matrix' | 'bell-curve';
  videoUrl?: string;
}
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
export interface AcademyQuizData {
  questions: QuizQuestion[];
}
export interface AcademyTopic {
  id: string;
  title: string;
  description: string;
  trackId: 'foundations' | 'risk' | 'quantitative';
  category: 'Risk' | 'Strategy' | 'Basics' | 'Advanced';
  difficulty: AcademyDifficulty;
  readingTimeMin: number;
  content: string;
  steps: AcademyStep[];
  quiz?: AcademyQuizData;
}
export interface FinancialTerm {
  term: string;
  definition: string;
  category: string;
}