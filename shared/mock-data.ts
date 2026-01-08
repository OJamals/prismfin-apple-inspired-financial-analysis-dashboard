import {
  DashboardData,
  TimeRange,
  TradingMode,
  SeriesPoint,
  Kpi,
  MetricsRow,
  Alert,
  QuantData,
  FactorAttribution,
  MonteCarloStats,
  MonteCarloSeriesPoint,
  RiskRewardPoint,
  DrawdownData,
  DrawdownPoint,
  CorrelationData,
  HoldingsMetrics
} from './types';
export function calculateHoldingsMetrics(rows: MetricsRow[]): HoldingsMetrics {
  if (!rows || rows.length === 0) {
    return {
      diversificationPct: 0,
      diversificationLabel: 'No assets detected',
      riskLevel: 'Moderate',
      beta: 1.0,
      yieldPct: 0,
      yieldLabel: 'N/A'
    };
  }
  const uniqueClasses = new Set(rows.map(r => r.class));
  const diversificationPct = Math.min(100, (uniqueClasses.size / 4) * 100);
  const avgSentiment = rows.reduce((acc, r) => acc + r.sentiment, 0) / rows.length;
  let riskLevel: 'Conservative' | 'Moderate' | 'Aggressive' = 'Moderate';
  if (avgSentiment > 80) riskLevel = 'Aggressive';
  else if (avgSentiment < 40) riskLevel = 'Conservative';
  const hasCrypto = rows.some(r => r.class === 'crypto');
  const beta = hasCrypto ? 1.42 : 1.08;
  const yieldPct = rows.reduce((acc, r) => acc + (r.class === 'fixed-income' ? 4.5 : 1.2), 0) / rows.length;
  return {
    diversificationPct,
    diversificationLabel: diversificationPct > 70 ? 'High across sectors' : 'Concentrated',
    riskLevel,
    beta,
    yieldPct: parseFloat(yieldPct.toFixed(2)),
    yieldLabel: 'Annual projection'
  };
}
export function getMockKPIs(mode: TradingMode): Kpi[] {
  const isLive = mode === 'live';
  const jitter = () => (Math.random() - 0.5) * 50;
  return [
    { id: '1', label: 'Portfolio Value', value: (isLive ? 124500.65 : 158200.40) + jitter(), deltaPct: (isLive ? 2.4 : 5.8) + (Math.random() * 0.2) },
    { id: '2', label: 'Daily P&L', value: (isLive ? 3450.21 : 1200.45) + jitter(), deltaPct: (isLive ? 1.2 : 0.8) + (Math.random() * 0.1) },
    { id: '3', label: 'YTD Return', value: (isLive ? 15.8 : 22.4) + (Math.random() * 0.5), deltaPct: (isLive ? 0.5 : 1.2) + (Math.random() * 0.1) },
    { id: '4', label: 'Total Gains', value: (isLive ? 24500.00 : 38200.00) + jitter(), deltaPct: (isLive ? 4.8 : 7.2) + (Math.random() * 0.3) },
  ];
}
export function getMockPerformance(range: TimeRange, mode: TradingMode): SeriesPoint[] {
  const isLive = mode === 'live';
  const volatility = isLive ? 3000 : 800;
  const bias = isLive ? -0.45 : 0.15;
  const points = range === '1M' ? 30 : range === '3M' ? 90 : range === '6M' ? 180 : 365;
  const skip = range === '1M' ? 1 : range === '3M' ? 3 : range === '6M' ? 6 : 12;
  const results: SeriesPoint[] = [];
  let current = 100000 + (Math.random() * 5000);
  for (let i = 0; i < points; i += skip) {
    current += (Math.random() + bias) * volatility;
    results.push({ label: `Day ${i}`, value: parseFloat(current.toFixed(2)) });
  }
  return results;
}
export function getMockCashflow(): SeriesPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(m => ({ label: m, value: 4000 + Math.random() * 3000 }));
}
function generateMiniSeries(base: number): SeriesPoint[] {
  return Array.from({ length: 7 }).map((_, i) => ({
    label: `T-${6-i}`,
    value: base * (0.92 + Math.random() * 0.16)
  }));
}
export function getMockRows(): MetricsRow[] {
  const jitter = (val: number, factor: number = 0.05) => val * (1 + (Math.random() - 0.5) * factor);
  return [
    { name: 'Apple Inc.', symbol: 'AAPL', price: jitter(189.43), changePct: jitter(1.2, 0.5), ytdPct: 12.4, volume: '54.2M', class: 'equity', sentiment: Math.floor(jitter(78, 0.2)), peRatio: 28.4, rsi: 62, miniSeries: generateMiniSeries(189) },
    { name: 'Microsoft Corp.', symbol: 'MSFT', price: jitter(415.22), changePct: jitter(-0.4, 0.5), ytdPct: 15.1, volume: '22.1M', class: 'equity', sentiment: Math.floor(jitter(65, 0.2)), peRatio: 35.2, rsi: 48, miniSeries: generateMiniSeries(415) },
    { name: 'Nvidia Corp.', symbol: 'NVDA', price: jitter(882.33), changePct: jitter(3.5, 0.5), ytdPct: 78.2, volume: '88.5M', class: 'equity', sentiment: Math.floor(jitter(92, 0.2)), peRatio: 74.1, rsi: 72, miniSeries: generateMiniSeries(882) },
    { name: 'Bitcoin', symbol: 'BTC', price: jitter(64200), changePct: jitter(5.2, 1.0), ytdPct: 45.1, volume: '32.1B', class: 'crypto', sentiment: Math.floor(jitter(84, 0.2)), rsi: 68, miniSeries: generateMiniSeries(64200) },
    { name: 'Ethereum', symbol: 'ETH', price: jitter(3450), changePct: jitter(-1.2, 1.0), ytdPct: 32.4, volume: '18.4B', class: 'crypto', sentiment: Math.floor(jitter(71, 0.2)), rsi: 54, miniSeries: generateMiniSeries(3450) },
    { name: 'US 10Y Treasury', symbol: 'US10Y', price: jitter(98.42, 0.01), changePct: jitter(0.1, 0.1), ytdPct: -2.4, volume: 'N/A', class: 'fixed-income', sentiment: Math.floor(jitter(45, 0.1)), rsi: 42, miniSeries: generateMiniSeries(98) },
  ];
}
export function generateAlerts(rows: MetricsRow[], mode: TradingMode): Alert[] {
  const alerts: Alert[] = [];
  const threshold = mode === 'live' ? 2 : 4;
  rows.forEach(r => {
    if (Math.abs(r.changePct) > threshold) {
      alerts.push({
        id: `alert-${r.symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        type: 'volatility',
        message: `${mode.toUpperCase()} Alert: ${r.symbol} ${r.changePct.toFixed(2)}% move detected.`,
        priority: Math.abs(r.changePct) > 5 ? 'high' : 'medium',
        timestamp: Date.now(),
        assetSymbol: r.symbol
      });
    }
  });
  if (alerts.length === 0) {
    alerts.push({
      id: `alert-system-${Date.now()}`,
      type: 'info',
      message: `${mode === 'live' ? 'Live market' : 'Paper sim'} stability confirmed.`,
      priority: 'low',
      timestamp: Date.now()
    });
  }
  return alerts;
}
export function generateDashboard(range: TimeRange, mode: TradingMode): DashboardData {
  const rows = getMockRows();
  return {
    range,
    mode,
    updatedAt: Date.now(),
    kpis: getMockKPIs(mode),
    holdingsMetrics: calculateHoldingsMetrics(rows),
    performance: getMockPerformance(range, mode),
    cashflow: getMockCashflow(),
    rows: rows,
    alerts: generateAlerts(rows, mode)
  };
}
function generateMonteCarlo(horizon: '1Y' | '5Y' | '10Y', mode: TradingMode): MonteCarloStats {
  const isLive = mode === 'live';
  const years = horizon === '1Y' ? 1 : horizon === '5Y' ? 5 : 10;
  const steps = 12 * years;
  const series: MonteCarloSeriesPoint[] = [];
  let currentMedian = (isLive ? 124500 : 158200) * (0.98 + Math.random() * 0.04);
  const drift = isLive ? 0.008 : 0.012;
  const volBase = isLive ? 0.05 : 0.03;
  for (let i = 0; i <= steps; i++) {
    // Dispersion grows with sqrt of time
    const vol = volBase * Math.sqrt((i + 1) / 12);
    series.push({
      label: `Month ${i}`,
      median: parseFloat(currentMedian.toFixed(2)),
      p10: parseFloat((currentMedian * (1 - vol * 1.28)).toFixed(2)),
      p90: parseFloat((currentMedian * (1 + vol * 1.28)).toFixed(2)),
    });
    currentMedian *= (1 + drift);
  }
  const last = series[series.length - 1];
  return { horizon, median: last.median, p10: last.p10, p90: last.p90, series };
}
function generateRiskRewardData(): RiskRewardPoint[] {
  const symbols = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'GOOGL', 'AMZN', 'META', 'BRK.B', 'BTC', 'ETH', 'GOLD', 'TLT'];
  return symbols.map(s => {
    // More distinct clusters
    const isVolatile = ['BTC', 'ETH', 'TSLA', 'NVDA'].includes(s);
    const isSafe = ['GOLD', 'TLT', 'BRK.B'].includes(s);
    const ret = isVolatile ? (15 + Math.random() * 35) : isSafe ? (2 + Math.random() * 8) : (8 + Math.random() * 15);
    const vol = isVolatile ? (25 + Math.random() * 50) : isSafe ? (5 + Math.random() * 15) : (15 + Math.random() * 20);
    const sharpe = parseFloat((ret / vol).toFixed(2));
    return {
      symbol: s,
      returns: parseFloat(ret.toFixed(2)),
      volatility: parseFloat(vol.toFixed(2)),
      sharpe: sharpe,
      weight: parseFloat((2 + Math.random() * 23).toFixed(1))
    };
  });
}
function generateDrawdownData(performance: SeriesPoint[]): DrawdownData {
  let peak = -Infinity;
  let maxDD = 0;
  const series: DrawdownPoint[] = performance.map(p => {
    if (p.value > peak) peak = p.value;
    const ddPct = peak === 0 ? 0 : ((p.value - peak) / peak) * 100;
    if (ddPct < maxDD) maxDD = ddPct;
    return { label: p.label, value: p.value, drawdownPct: parseFloat(ddPct.toFixed(2)) };
  });
  return { maxDrawdown: parseFloat(maxDD.toFixed(2)), series };
}
function generateCorrelationMatrix(): CorrelationData {
  const symbols = ['AAPL', 'MSFT', 'NVDA', 'BTC', 'GOLD'];
  const matrix: Record<string, Record<string, number>> = {};
  symbols.forEach((s1, i) => {
    matrix[s1] = {};
    symbols.forEach((s2, j) => {
      if (i === j) {
        matrix[s1][s2] = 1.0;
      } else {
        // Create some negative correlations (e.g., Gold vs BTC/Tech)
        const isHedge = (s1 === 'GOLD' || s2 === 'GOLD');
        const base = isHedge ? -0.4 : 0.6;
        matrix[s1][s2] = parseFloat((base + (Math.random() - 0.5) * 0.4).toFixed(2));
      }
    });
  });
  return { symbols, matrix };
}
export function generateQuantData(range: TimeRange, mode: TradingMode): QuantData {
  const portfolio = getMockPerformance(range, mode);
  const benchmark = portfolio.map(p => ({
    label: p.label,
    value: parseFloat((p.value * (0.95 + Math.random() * 0.08)).toFixed(2))
  }));
  const factors: FactorAttribution[] = [
    { label: 'Quality', value: 35, color: '#14B8A6' },
    { label: 'Growth', value: 30, color: '#0EA5E9' },
    { label: 'Momentum', value: 20, color: '#6366F1' },
    { label: 'Volatility', value: 15, color: '#F43F5E' },
  ];
  return {
    range,
    mode,
    updatedAt: Date.now(),
    portfolio,
    benchmark,
    factors,
    monteCarlo: {
      '1Y': generateMonteCarlo('1Y', mode),
      '5Y': generateMonteCarlo('5Y', mode),
      '10Y': generateMonteCarlo('10Y', mode),
    },
    riskReward: generateRiskRewardData(),
    drawdown: generateDrawdownData(portfolio),
    correlation: generateCorrelationMatrix()
  };
}