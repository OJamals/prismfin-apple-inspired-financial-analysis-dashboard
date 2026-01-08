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
  Alert
} from './types';
const SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'V', 'JPM', 'UNH',
  'HD', 'PG', 'MA', 'XOM', 'CVX', 'ABBV', 'LLY', 'PEP', 'KO', 'COST',
  'AVGO', 'CSCO', 'ACN', 'ORCL', 'ADBE', 'LIN', 'TXN', 'MRK', 'PFE', 'NKE',
  'AMD', 'NFLX', 'INTC', 'CMCSA', 'QCOM', 'HON', 'AMAT', 'SBUX', 'LOW', 'CAT',
  'INTU', 'UPS', 'IBM', 'BA', 'AMGN', 'GE', 'MS', 'NEE', 'PM', 'GS'
];
const SECTORS = ['Technology', 'Financials', 'Healthcare', 'Energy', 'Consumer Staples', 'Consumer Discretionary', 'Industrials', 'Real Estate'];
export function generateTechnicalAlerts(): Alert[] {
  const alerts: Alert[] = [
    {
      id: 'alert-1',
      type: 'technical',
      priority: 'high',
      message: 'Golden Cross detected: NVDA 50-day EMA crossed above 200-day EMA.',
      timestamp: Date.now() - 1000 * 60 * 45,
      assetSymbol: 'NVDA'
    },
    {
      id: 'alert-2',
      type: 'volatility',
      priority: 'medium',
      message: 'Abnormal Volatility Spike: BTC daily range exceeded 8.5%.',
      timestamp: Date.now() - 1000 * 60 * 120,
      assetSymbol: 'BTC'
    },
    {
      id: 'alert-3',
      type: 'sentiment',
      priority: 'low',
      message: 'Social Sentiment Surge: Unusual retail interest spike for TSLA.',
      timestamp: Date.now() - 1000 * 60 * 300,
      assetSymbol: 'TSLA'
    },
    {
      id: 'alert-4',
      type: 'technical',
      priority: 'high',
      message: 'RSI Divergence: AAPL showing oversold conditions on H4 timeframe.',
      timestamp: Date.now() - 1000 * 60 * 15,
      assetSymbol: 'AAPL'
    }
  ];
  return alerts;
}
export function getMockScreenerData(): ScreenerStock[] {
  return SYMBOLS.map((symbol, i) => {
    const sector = SECTORS[i % SECTORS.length];
    let peBase = 15;
    let yieldBase = 1.5;
    let pegBase = 1.2;
    if (sector === 'Technology') { peBase = 25; yieldBase = 0.5; pegBase = 1.8; }
    if (sector === 'Energy') { peBase = 10; yieldBase = 4.0; pegBase = 0.8; }
    if (sector === 'Financials') { peBase = 12; yieldBase = 2.5; pegBase = 1.0; }
    const sentimentScore = Math.random();
    const sentiment: SentimentCategory = sentimentScore > 0.6 ? 'Bullish' : sentimentScore < 0.3 ? 'Bearish' : 'Neutral';
    return {
      symbol,
      name: `${symbol} Corporation`,
      price: 50 + Math.random() * 450,
      changePct: (Math.random() - 0.4) * 6,
      peRatio: peBase + Math.random() * 10,
      pegRatio: pegBase + Math.random() * 0.8,
      yieldPct: yieldBase + Math.random() * 2,
      marketCap: `${(0.1 + Math.random() * 2.5).toFixed(1)}T`,
      volatility: 15 + Math.random() * 25,
      sharpe: 0.2 + Math.random() * 2.5,
      beta: 0.5 + Math.random() * 1.5,
      sector,
      sentiment,
      miniSeries: Array.from({ length: 10 }).map((_, j) => ({
        label: `T-${j}`,
        value: 100 + (Math.random() - 0.5) * 20
      }))
    };
  });
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
      content: 'The Sharpe ratio measures the performance of an investment compared to a risk-free asset, after adjusting for its risk.',
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
  const series: MonteCarloSeriesPoint[] = Array.from({ length: steps }).map((_, i) => {
    const base = 100000 * Math.pow(1.006, i);
    return {
      label: `Step ${i}`,
      p10: base * (1 - 0.08 * Math.random()),
      median: base,
      p90: base * (1 + 0.08 * Math.random())
    };
  });
  const last = series[series.length - 1];
  return { horizon, p10: last.p10, median: last.median, p90: last.p90, series };
}
export function generateRiskReward(): RiskRewardPoint[] {
  const assets = ['AAPL', 'MSFT', 'BTC', 'GLD', 'SPY', 'TSLA', 'AMZN', 'GOOG', 'JPM', 'XOM'];
  const baseWeights = assets.map(() => Math.random());
  const sumWeights = baseWeights.reduce((a, b) => a + b, 0);
  return assets.map((s, i) => ({
    symbol: s,
    returns: 5 + Math.random() * 20,
    volatility: 10 + Math.random() * 30,
    sharpe: 0.2 + Math.random() * 2.2,
    weight: (baseWeights[i] / sumWeights) * 100
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
      if (s1 === s2) matrix[s1][s2] = 1;
      else matrix[s1][s2] = (Math.random() * 2 - 1);
    });
  });
  return { symbols, matrix };
}
export function generateDashboard(range: TimeRange): DashboardData {
  const rows = getMockRows();
  const topMovers = [...rows].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Base benchmark (S&P 500 equivalent)
  const baseBenchmark = Array.from({ length: 20 }).map((_, i) => ({ 
    label: `Day ${i}`, 
    value: 100000 + i * 400 + (Math.random() - 0.5) * 500 
  }));
  return {
    range, 
    updatedAt: Date.now(),
    kpis: getMockKPIs(),
    holdingsMetrics: {
      diversificationPct: 82,
      diversificationLabel: 'High across sectors',
      riskLevel: 'Moderate',
      beta: 1.08,
      yieldPct: 1.25,
      yieldLabel: 'Annual projection'
    },
    performance: Array.from({ length: 20 }).map((_, i) => ({ 
      label: `Day ${i}`, 
      value: 100000 + i * 500 + (Math.random() - 0.5) * 1000 
    })),
    benchmarkPerformance: baseBenchmark,
    monthlyReturns: months.map(m => ({ label: m, value: (Math.random() - 0.3) * 8 })),
    topMovers: topMovers.slice(0, 4),
    cashflow: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => ({ label: m, value: 4000 + Math.random() * 2000 })),
    rows: rows,
    alerts: generateTechnicalAlerts(),
    sectors: {
      'Technology': 28.5,
      'Financials': 15.2,
      'Healthcare': 12.8,
      'Energy': 8.4,
      'Consumer Disc.': 10.1,
      'Others': 25.0
    },
    riskReward: generateRiskReward().slice(0, 5)
  };
}
export function getMockKPIs(): Kpi[] {
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
    { name: 'Microsoft', symbol: 'MSFT', price: 420.55, changePct: -0.5, ytdPct: 8.2, volume: '18.4M', class: 'equity', sentiment: 72, miniSeries: [] },
    { name: 'Tesla Inc.', symbol: 'TSLA', price: 175.22, changePct: -3.4, ytdPct: -15.2, volume: '95.2M', class: 'equity', sentiment: 45, miniSeries: [] },
  ];
}
export function generateQuantData(range: TimeRange): QuantData {
  const dash = generateDashboard(range);
  return {
    range,
    updatedAt: Date.now(),
    insight: {
      summary: "Portfolio risk has escalated by 12% due to increased correlation between Technology holdings and Crypto assets.",
      attribution: "Alpha generation is currently driven by Quality factors (35%), while Momentum has stagnated in the mid-cap segment.",
      riskExposure: "Exposure to interest-rate sensitive sectors is at a 6-month high. Recommend hedging via fixed-income overlay.",
      recommendation: "Neutralize Beta by trimming TSLA and NVDA positions in favor of Consumer Staples for the Q1 horizon."
    },
    portfolio: dash.performance,
    benchmark: dash.benchmarkPerformance,
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