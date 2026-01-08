import { 
  DashboardData, 
  TimeRange, 
  SeriesPoint, 
  Kpi, 
  MetricsRow, 
  QuantData, 
  FactorAttribution, 
  MonteCarloStats, 
  MonteCarloSeriesPoint 
} from './types';
export function getMockKPIs(): Kpi[] {
  return [
    { id: '1', label: 'Portfolio Value', value: 124500.65, deltaPct: 2.4 },
    { id: '2', label: 'Daily P&L', value: 3450.21, deltaPct: 1.2 },
    { id: '3', label: 'YTD Return', value: 15.8, deltaPct: 0.5 },
    { id: '4', label: 'Total Gains', value: 24500.00, deltaPct: 4.8 },
  ];
}
export function getMockPerformance(range: TimeRange, volatility = 2000, bias = -0.45): SeriesPoint[] {
  const points = range === '1M' ? 30 : range === '3M' ? 90 : range === '6M' ? 180 : 365;
  const skip = range === '1M' ? 1 : range === '3M' ? 3 : range === '6M' ? 6 : 12;
  const results: SeriesPoint[] = [];
  let current = 100000;
  for (let i = 0; i < points; i += skip) {
    current += (Math.random() + bias) * volatility;
    results.push({
      label: `Day ${i}`,
      value: parseFloat(current.toFixed(2))
    });
  }
  return results;
}
export function getMockCashflow(): SeriesPoint[] {
  return [
    { label: 'Jan', value: 4500 },
    { label: 'Feb', value: 5200 },
    { label: 'Mar', value: 4800 },
    { label: 'Apr', value: 6100 },
    { label: 'May', value: 5900 },
    { label: 'Jun', value: 7200 },
  ];
}
export function getMockRows(): MetricsRow[] {
  return [
    { name: 'Apple Inc.', symbol: 'AAPL', price: 189.43, changePct: 1.2, ytdPct: 12.4, volume: '54.2M' },
    { name: 'Microsoft Corp.', symbol: 'MSFT', price: 415.22, changePct: -0.4, ytdPct: 15.1, volume: '22.1M' },
    { name: 'Nvidia Corp.', symbol: 'NVDA', price: 882.33, changePct: 3.5, ytdPct: 78.2, volume: '88.5M' },
    { name: 'Tesla Inc.', symbol: 'TSLA', price: 172.50, changePct: -2.1, ytdPct: -31.4, volume: '95.2M' },
    { name: 'Alphabet Inc.', symbol: 'GOOGL', price: 154.21, changePct: 0.8, ytdPct: 9.8, volume: '28.4M' },
  ];
}
export function generateDashboard(range: TimeRange): DashboardData {
  return {
    range,
    updatedAt: Date.now(),
    kpis: getMockKPIs(),
    performance: getMockPerformance(range),
    cashflow: getMockCashflow(),
    rows: getMockRows(),
  };
}
function generateMonteCarlo(horizon: '1Y' | '5Y' | '10Y'): MonteCarloStats {
  const years = horizon === '1Y' ? 1 : horizon === '5Y' ? 5 : 10;
  const steps = 12 * years;
  const series: MonteCarloSeriesPoint[] = [];
  let currentMedian = 124500;
  const drift = 0.008; // 0.8% monthly drift
  const vol = 0.04; // 4% monthly vol
  for (let i = 0; i <= steps; i++) {
    const timeRatio = i / steps;
    const spread = currentMedian * vol * Math.sqrt(i + 1);
    series.push({
      label: `Month ${i}`,
      median: parseFloat(currentMedian.toFixed(2)),
      p10: parseFloat((currentMedian - spread).toFixed(2)),
      p90: parseFloat((currentMedian + spread).toFixed(2)),
    });
    currentMedian *= (1 + drift);
  }
  const last = series[series.length - 1];
  return {
    horizon,
    median: last.median,
    p10: last.p10,
    p90: last.p90,
    series
  };
}
export function generateQuantData(range: TimeRange): QuantData {
  const portfolio = getMockPerformance(range, 2200, -0.42);
  const benchmark = portfolio.map(p => ({
    label: p.label,
    value: parseFloat((p.value * (0.95 + Math.random() * 0.08)).toFixed(2))
  }));
  const factors: FactorAttribution[] = [
    { label: 'Growth', value: 45, color: '#14B8A6' },
    { label: 'Value', value: 20, color: '#0EA5E9' },
    { label: 'Momentum', value: 15, color: '#6366F1' },
    { label: 'Quality', value: 20, color: '#F59E0B' },
  ];
  return {
    range,
    updatedAt: Date.now(),
    portfolio,
    benchmark,
    factors,
    monteCarlo: {
      '1Y': generateMonteCarlo('1Y'),
      '5Y': generateMonteCarlo('5Y'),
      '10Y': generateMonteCarlo('10Y'),
    }
  };
}