import {
  DashboardData,
  TimeRange,
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
  MonteCarloSeriesPoint,
  SentimentCategory,
  Alert,
  FinancialTerm
} from './types';
export const GLOSSARY_TERMS: FinancialTerm[] = [
  { term: 'Alpha', definition: 'The excess return of an investment relative to the return of a benchmark index.', category: 'Performance' },
  { term: 'Beta', definition: 'A measure of a stock\'s volatility in relation to the overall market (S&P 500 = 1.0).', category: 'Risk' },
  { term: 'Sharpe Ratio', definition: 'Measures the performance of an investment compared to a risk-free asset, adjusted for its risk.', category: 'Risk' },
  { term: 'Standard Deviation', definition: 'A statistical measure of market volatility, showing how much prices deviate from the average.', category: 'Statistics' },
  { term: 'Normal Distribution', definition: 'A probability distribution that is symmetric about the mean (Bell Curve).', category: 'Statistics' },
  { term: 'Monte Carlo Simulation', definition: 'A mathematical technique used to estimate the possible outcomes of an uncertain event.', category: 'Forecasting' },
  { term: 'Correlation', definition: 'A statistic that measures the degree to which two securities move in relation to each other.', category: 'Risk' },
  { term: 'Drawdown', definition: 'The peak-to-trough decline during a specific period for an investment.', category: 'Risk' },
  { term: 'Efficiency Frontier', definition: 'A set of optimal portfolios that offer the highest expected return for a defined level of risk.', category: 'Portfolio Theory' },
  { term: 'PEG Ratio', definition: 'Price/Earnings to Growth ratio; used to determine a stock\'s value while taking into account earnings growth.', category: 'Valuation' },
];
const SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'V', 'JPM', 'UNH'];
const SECTORS = ['Technology', 'Financials', 'Healthcare', 'Energy'];
export function generateTechnicalAlerts(): Alert[] {
  return [
    { id: 'alert-1', type: 'technical', priority: 'high', message: 'Golden Cross detected: NVDA 50-day EMA crossed above 200-day EMA.', timestamp: Date.now() - 45 * 60000, assetSymbol: 'NVDA' },
    { id: 'alert-2', type: 'volatility', priority: 'medium', message: 'Abnormal Volatility Spike: BTC daily range exceeded 8.5%.', timestamp: Date.now() - 120 * 60000, assetSymbol: 'BTC' },
  ];
}
export function getMockScreenerData(): ScreenerStock[] {
  return SYMBOLS.map((symbol, i) => ({
    symbol,
    name: `${symbol} Corp`,
    price: 50 + Math.random() * 450,
    changePct: (Math.random() - 0.4) * 6,
    peRatio: 15 + Math.random() * 10,
    pegRatio: 1.0 + Math.random() * 0.5,
    yieldPct: 1.5 + Math.random() * 2,
    marketCap: "1.2T",
    volatility: 20,
    sharpe: 1.5,
    beta: 1.1,
    sector: SECTORS[i % SECTORS.length],
    sentiment: 'Bullish',
    miniSeries: Array.from({ length: 10 }).map((_, j) => ({ label: `T-${j}`, value: 100 + Math.random() * 20 }))
  }));
}
export function generateSentimentOverview(symbol: string): SentimentOverview {
  return {
    symbol,
    overallScore: 72,
    mentions24h: 1240,
    trend: 'improving',
    articles: Array.from({ length: 4 }).map((_, i) => ({
      id: `art-${i}`,
      source: 'Bloomberg',
      headline: `${symbol} Analysis: Bullish institutional sentiment detected.`,
      summary: 'Hedge funds are increasing allocations due to strong earnings.',
      timestamp: Date.now() - i * 3600000,
      sentiment: 'positive',
      score: 85,
      url: '#'
    }))
  };
}
export function getMockAcademyTopics(): AcademyTopic[] {
  return [
    {
      id: 'foundations-101',
      trackId: 'foundations',
      title: 'The Sharpe Ratio',
      description: 'Master the core metric of risk-adjusted returns.',
      category: 'Basics',
      difficulty: 'Beginner',
      readingTimeMin: 6,
      content: 'The Sharpe ratio is the standard for institutional performance appraisal.',
      steps: [
        { id: 's1', title: 'Introduction', type: 'content', content: 'Learn why returns alone are deceptive.' },
        { id: 's2', title: 'The Formula', type: 'content', content: 'Understanding the excess return over risk-free rate.', formula: 'S = (R_p - R_f) / \\\\sigma_p' },
        { id: 's3', title: 'Interactive Calc', type: 'interactive', interactiveType: 'sharpe-calc', content: 'Try simulating different risk profiles.' },
        { id: 's4', title: 'Assessment', type: 'quiz', content: 'Test your understanding.' }
      ],
      quiz: {
        questions: [
          { question: 'What does a higher Sharpe ratio indicate?', options: ['Higher risk', 'Better risk-adjusted return', 'Lower volatility only', 'Higher cash drag'], correctIndex: 1, explanation: 'A higher Sharpe ratio means you are getting more return per unit of volatility.' }
        ]
      }
    },
    {
      id: 'risk-201',
      trackId: 'risk',
      title: 'The Bell Curve',
      description: 'Understanding Normal Distribution in market volatility.',
      category: 'Risk',
      difficulty: 'Intermediate',
      readingTimeMin: 8,
      content: 'Markets often deviate from the "Normal", but the curve remains our baseline.',
      steps: [
        { id: 'r1', title: 'Probability Basics', type: 'content', content: 'The 68-95-99.7 rule.' },
        { id: 'r2', title: 'Visualizing SD', type: 'diagram', interactiveType: 'bell-curve', content: 'Observe how Standard Deviation widens the distribution.' },
        { id: 'r3', title: 'Fat Tails', type: 'content', content: 'Why real markets are not always normal.' }
      ]
    },
    {
      id: 'quant-301',
      trackId: 'quantitative',
      title: 'Monte Carlo Forecasts',
      description: 'Using statistical sampling for long-term wealth projections.',
      category: 'Advanced',
      difficulty: 'Advanced',
      readingTimeMin: 12,
      content: 'Simulating thousands of market paths to understand terminal value.',
      steps: [
        { id: 'q1', title: 'Statistical Sampling', type: 'content', content: 'The power of large numbers.' },
        { id: 'q2', title: 'Path Dependency', type: 'interactive', interactiveType: 'monte-carlo-sim', content: 'Simulate 1,000 portfolio paths.' }
      ]
    }
  ];
}
export function generateDashboard(range: TimeRange): DashboardData {
  return {
    range,
    updatedAt: Date.now(),
    kpis: [
      { id: '1', label: 'Portfolio Value', value: 124500.65, deltaPct: 2.4 },
      { id: '2', label: 'Daily P&L', value: 3450.21, deltaPct: 1.2 },
      { id: '3', label: 'YTD Return', value: 15.8, deltaPct: 0.5 },
      { id: '4', label: 'Total Gains', value: 24500.00, deltaPct: 4.8 },
    ],
    holdingsMetrics: { diversificationPct: 82, diversificationLabel: 'High', riskLevel: 'Moderate', beta: 1.08, yieldPct: 1.25, yieldLabel: 'Annual' },
    performance: Array.from({ length: 20 }).map((_, i) => ({ label: `T-${i}`, value: 100000 + i * 500 })),
    benchmarkPerformance: Array.from({ length: 20 }).map((_, i) => ({ label: `T-${i}`, value: 100000 + i * 400 })),
    monthlyReturns: Array.from({ length: 12 }).map((_, i) => ({ label: `M${i}`, value: 2 + Math.random() * 5 })),
    topMovers: [],
    cashflow: [],
    rows: [],
    alerts: generateTechnicalAlerts(),
    sectors: { 'Tech': 30, 'Finance': 20, 'Health': 25, 'Other': 25 },
    riskReward: []
  };
}
export function generateQuantData(range: TimeRange): QuantData {
  return {
    range,
    updatedAt: Date.now(),
    insight: { summary: 'Insight', attribution: 'Attr', riskExposure: 'Risk', recommendation: 'Rec' },
    portfolio: [],
    benchmark: [],
    factors: [],
    monteCarlo: {} as any,
    riskReward: [],
    drawdown: { maxDrawdown: 10, series: [] },
    correlation: { symbols: [], matrix: {} }
  };
}
export function getMockRows(): MetricsRow[] {
  return [];
}