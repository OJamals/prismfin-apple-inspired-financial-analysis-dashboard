import {
  DashboardData,
  TimeRange,
  TradingMode,
  SeriesPoint,
  Kpi,
  MetricsRow,
  QuantData,
  ScreenerStock,
  SentimentOverview,
  SentimentArticle,
  AcademyTopic,
  FactorAttribution,
  MonteCarloStats,
  RiskRewardPoint,
  DrawdownData,
  CorrelationData,
  MonteCarloSeriesPoint
} from './types';
export function getMockScreenerData(): ScreenerStock[] {
  const sectors = ['Technology', 'Energy', 'Healthcare', 'Financials', 'Consumer Staples', 'Real Estate'];
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'V', 'JPM', 'UNH'];
  return symbols.map((symbol, i) => ({
    symbol,
    name: `${symbol} Corp`,
    price: 100 + Math.random() * 500,
    changePct: (Math.random() - 0.4) * 5,
    peRatio: 15 + Math.random() * 20,
    yieldPct: Math.random() * 4,
    marketCap: `${(Math.random() * 2).toFixed(1)}T`,
    volatility: 15 + Math.random() * 20,
    sharpe: 0.5 + Math.random() * 2,
    sector: sectors[i % sectors.length]
  }));
}
export function generateSentimentOverview(symbol: string): SentimentOverview {
  const articles: SentimentArticle[] = Array.from({ length: 5 }).map((_, i) => ({
    id: `art-${symbol}-${i}`,
    source: ['Bloomberg', 'WSJ', 'Reuters'][i % 3],
    headline: `${symbol} shows ${Math.random() > 0.5 ? 'growth' : 'volatility'} in recent quarterly audit`,
    summary: "Institutional analysis points to a shift in capital allocation strategies among top-tier hedge funds.",
    timestamp: Date.now() - (i * 3600000),
    sentiment: Math.random() > 0.4 ? 'positive' : 'negative',
    score: Math.floor(30 + Math.random() * 70),
    url: "#"
  }));
  return {
    symbol,
    overallScore: Math.floor(articles.reduce((acc, a) => acc + a.score, 0) / articles.length),
    mentions24h: 250 + Math.floor(Math.random() * 1000),
    trend: Math.random() > 0.5 ? 'improving' : 'stable',
    articles
  };
}
export function getMockAcademyTopics(): AcademyTopic[] {
  return [
    {
      id: 'sharpe-101',
      title: 'The Sharpe Ratio',
      description: 'Understanding risk-adjusted returns and capital efficiency.',
      category: 'Risk',
      difficulty: 'Beginner',
      readingTimeMin: 5,
      content: 'The Sharpe ratio measures the performance of an investment compared to a risk-free asset, after adjusting for its risk. It is the gold standard for institutional portfolio evaluation.',
      interactiveType: 'sharpe-calc'
    },
    {
      id: 'mc-projections',
      title: 'Monte Carlo Simulations',
      description: 'How statistical sampling predicts long-term portfolio wealth.',
      category: 'Advanced',
      difficulty: 'Intermediate',
      readingTimeMin: 8,
      content: 'Monte Carlo simulations use repeated random sampling to obtain numerical results for complex probabilistic systems.',
      interactiveType: 'monte-carlo-sim'
    }
  ];
}
export function generateFactors(): FactorAttribution[] {
  return [
    { label: 'Quality', value: 35, color: '#14B8A6' },
    { label: 'Growth', value: 30, color: '#0EA5E9' },
    { label: 'Value', value: 15, color: '#6366F1' },
    { label: 'Momentum', value: 12, color: '#F59E0B' },
    { label: 'Volatility', value: 8, color: '#EF4444' }
  ];
}
export function generateMonteCarloStats(horizon: '1Y' | '5Y' | '10Y'): MonteCarloStats {
  const steps = horizon === '1Y' ? 12 : horizon === '5Y' ? 60 : 120;
  const series: MonteCarloSeriesPoint[] = Array.from({ length: steps }).map((_, i) => ({
    label: `Step ${i}`,
    p10: 100000 * Math.pow(1.002, i) * (1 - 0.05 * Math.random()),
    median: 100000 * Math.pow(1.006, i),
    p90: 100000 * Math.pow(1.01, i) * (1 + 0.05 * Math.random())
  }));
  const last = series[series.length - 1];
  return { horizon, p10: last.p10, median: last.median, p90: last.p90, series };
}
export function generateRiskReward(): RiskRewardPoint[] {
  return ['AAPL', 'MSFT', 'BTC', 'GLD', 'SPY', 'TSLA', 'AMZN', 'GOOG', 'JPM', 'XOM'].map(s => ({
    symbol: s,
    returns: 5 + Math.random() * 20,
    volatility: 10 + Math.random() * 30,
    sharpe: 0.5 + Math.random() * 2,
    weight: Math.random() * 25
  }));
}
export function generateDrawdown(): DrawdownData {
  return {
    maxDrawdown: 12.4,
    series: Array.from({ length: 30 }).map((_, i) => ({
      label: `T-${30 - i}`,
      value: 120000 - Math.random() * 5000,
      drawdownPct: -Math.random() * 12.4
    }))
  };
}
export function generateCorrelationMatrix(): CorrelationData {
  const symbols = ['AAPL', 'MSFT', 'BTC', 'SPY', 'GLD'];
  const matrix: Record<string, Record<string, number>> = {};
  symbols.forEach(s1 => {
    matrix[s1] = {};
    symbols.forEach(s2 => {
      matrix[s1][s2] = s1 === s2 ? 1 : (Math.random() * 2 - 1);
    });
  });
  return { symbols, matrix };
}
export function generateQuantData(range: TimeRange, mode: TradingMode): QuantData {
  return {
    range,
    mode,
    updatedAt: Date.now(),
    portfolio: Array.from({ length: 20 }).map((_, i) => ({ label: `D${i}`, value: 100000 + i * 800 })),
    benchmark: Array.from({ length: 20 }).map((_, i) => ({ label: `D${i}`, value: 100000 + i * 600 })),
    factors: generateFactors(),
    monteCarlo: {
      '1Y': generateMonteCarloStats('1Y'),
      '5Y': generateMonteCarloStats('5Y'),
      '10Y': generateMonteCarloStats('10Y')
    },
    riskReward: generateRiskReward(),
    drawdown: generateDrawdown(),
    correlation: generateCorrelationMatrix()
  };
}
export function calculateHoldingsMetrics(rows: MetricsRow[]) {
  return {
    diversificationPct: 82,
    diversificationLabel: 'High across sectors',
    riskLevel: 'Moderate' as const,
    beta: 1.08,
    yieldPct: 1.25,
    yieldLabel: 'Annual projection'
  };
}
export function getMockKPIs(mode: TradingMode): Kpi[] {
  return [
    { id: '1', label: 'Portfolio Value', value: 124500.65, deltaPct: 2.4 },
    { id: '2', label: 'Daily P&L', value: 3450.21, deltaPct: 1.2 },
    { id: '3', label: 'YTD Return', value: 15.8, deltaPct: 0.5 },
    { id: '4', label: 'Total Gains', value: 24500.00, deltaPct: 4.8 },
  ];
}
export function getMockRows(): MetricsRow[] {
  return [
    { name: 'Apple Inc.', symbol: 'AAPL', price: 189.43, changePct: 1.2, ytdPct: 12.4, volume: '54.2M', class: 'equity', sentiment: 78, miniSeries: [] },
    { name: 'Bitcoin', symbol: 'BTC', price: 64200, changePct: 5.2, ytdPct: 45.1, volume: '32.1B', class: 'crypto', sentiment: 84, miniSeries: [] },
  ];
}
export function generateDashboard(range: TimeRange, mode: TradingMode): DashboardData {
  return {
    range, mode, updatedAt: Date.now(),
    kpis: getMockKPIs(mode),
    holdingsMetrics: calculateHoldingsMetrics([]),
    performance: Array.from({ length: 20 }).map((_, i) => ({ label: `Day ${i}`, value: 100000 + i * 500 })),
    cashflow: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => ({ label: m, value: 4000 + Math.random() * 2000 })),
    rows: getMockRows(),
    alerts: []
  };
}