import {
  DashboardData,
  TimeRange,
  TradingMode,
  SeriesPoint,
  Kpi,
  MetricsRow,
  Alert,
  QuantData,
  ScreenerStock,
  SentimentOverview,
  SentimentArticle,
  AcademyTopic
} from './types';
export function getMockScreenerData(): ScreenerStock[] {
  const sectors = ['Technology', 'Energy', 'Healthcare', 'Financials', 'Consumer Staples', 'Real Estate'];
  const symbols = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK.B', 'V', 'JPM',
    'UNH', 'MA', 'XOM', 'HD', 'PG', 'COST', 'ABBV', 'JNJ', 'CRM', 'AVGO',
    'ORCL', 'CVX', 'MRK', 'ADBE', 'BAC', 'PEP', 'KO', 'TMO', 'WMT', 'LLY',
    'MCD', 'CSCO', 'ACN', 'ABT', 'LIN', 'PM', 'DHR', 'INTC', 'VZ', 'DIS',
    'NFLX', 'TXN', 'AMD', 'NKE', 'HON', 'AMAT', 'IBM', 'GE', 'LOW', 'QCOM'
  ];
  return symbols.map((symbol, i) => {
    const sector = sectors[i % sectors.length];
    const basePrice = 50 + Math.random() * 500;
    const peBase = sector === 'Technology' ? 25 : sector === 'Energy' ? 12 : 18;
    return {
      symbol,
      name: `${symbol} Corporation`,
      price: parseFloat(basePrice.toFixed(2)),
      changePct: parseFloat(((Math.random() - 0.4) * 4).toFixed(2)),
      peRatio: parseFloat((peBase + Math.random() * 10).toFixed(1)),
      yieldPct: parseFloat((Math.random() * 5).toFixed(2)),
      marketCap: `${(Math.random() * 2.5).toFixed(1)}T`,
      volatility: parseFloat((15 + Math.random() * 30).toFixed(1)),
      sharpe: parseFloat((0.5 + Math.random() * 2.5).toFixed(2)),
      sector
    };
  });
}
export function generateSentimentOverview(symbol: string): SentimentOverview {
  const sources = ['Bloomberg', 'Reuters', 'WSJ', 'Financial Times', 'CNBC'];
  const headlines = [
    "Institutional demand surges as earnings beat expectations",
    "Regulatory headwinds create uncertainty for upcoming product cycle",
    "Strategic partnership announced in emerging markets",
    "Analyst upgrade cites strong cash flow and margin expansion",
    "Market volatility pressures short-term growth outlook"
  ];
  const articles: SentimentArticle[] = Array.from({ length: 5 }).map((_, i) => ({
    id: `art-${symbol}-${i}`,
    source: sources[i % sources.length],
    headline: headlines[i % headlines.length].replace("Institutional", symbol),
    summary: "Professional analysis suggests a long-term bullish trend despite immediate macro fluctuations. Relative strength remains high vs peers.",
    timestamp: Date.now() - (i * 3600000 * 4),
    sentiment: Math.random() > 0.4 ? 'positive' : Math.random() > 0.5 ? 'neutral' : 'negative',
    score: Math.floor(40 + Math.random() * 60),
    url: "#"
  }));
  const avgScore = Math.floor(articles.reduce((acc, a) => acc + a.score, 0) / articles.length);
  return {
    symbol,
    overallScore: avgScore,
    mentions24h: Math.floor(150 + Math.random() * 500),
    trend: avgScore > 75 ? 'improving' : avgScore < 45 ? 'declining' : 'stable',
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
      content: 'The Sharpe ratio measures the performance of an investment compared to a risk-free asset, after adjusting for its risk. It is defined as the difference between the returns of the investment and the risk-free return, divided by the standard deviation of the investment returns.',
      interactiveType: 'sharpe-calc'
    },
    {
      id: 'mc-projections',
      title: 'Monte Carlo Simulations',
      description: 'How statistical sampling predicts long-term portfolio wealth.',
      category: 'Advanced',
      difficulty: 'Intermediate',
      readingTimeMin: 8,
      content: 'Monte Carlo simulations are used to model the probability of different outcomes in a process that cannot easily be predicted due to the intervention of random variables. It is a technique used to understand the impact of risk and uncertainty in financial forecasting.',
      interactiveType: 'monte-carlo-sim'
    },
    {
      id: 'drawdown-recovery',
      title: 'Drawdowns & Recoveries',
      description: 'The psychological and mathematical impact of market cycles.',
      category: 'Basics',
      difficulty: 'Beginner',
      readingTimeMin: 6,
      content: 'A drawdown is a peak-to-trough decline during a specific period for an investment, trading account, or fund. A drawdown is usually quoted as the percentage between the peak and the subsequent trough.'
    },
    {
      id: 'corr-matrix-mastery',
      title: 'Correlation Matrix',
      description: 'Building a truly diversified portfolio by observing asset move affinity.',
      category: 'Strategy',
      difficulty: 'Intermediate',
      readingTimeMin: 7,
      content: 'Correlation, in the finance and investment industries, is a statistic that measures the degree to which two securities move in relation to each other. Correlations are used in advanced portfolio management, computed as the correlation coefficient, which has a value that must fall between -1.0 and +1.0.',
      interactiveType: 'corr-matrix'
    }
  ];
}
// Keep existing generators for backward compatibility
export function calculateHoldingsMetrics(rows: MetricsRow[]) {
  const uniqueClasses = new Set(rows.map(r => r.class));
  const diversificationPct = Math.min(100, (uniqueClasses.size / 4) * 100);
  return {
    diversificationPct,
    diversificationLabel: diversificationPct > 70 ? 'High across sectors' : 'Concentrated',
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
export function getMockPerformance(range: TimeRange, mode: TradingMode): SeriesPoint[] {
  return Array.from({ length: 20 }).map((_, i) => ({ label: `Day ${i}`, value: 100000 + i * 500 + Math.random() * 2000 }));
}
export function getMockCashflow(): SeriesPoint[] {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => ({ label: m, value: 4000 + Math.random() * 2000 }));
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
    performance: getMockPerformance(range, mode),
    cashflow: getMockCashflow(),
    rows: getMockRows(),
    alerts: []
  };
}