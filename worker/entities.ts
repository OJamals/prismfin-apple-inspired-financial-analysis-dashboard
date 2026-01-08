import { Entity, Env } from "./core-utils";
import { DashboardData, TimeRange, QuantData, Alert, MetricsRow, TradingMode } from "@shared/types";
import { generateDashboard, generateQuantData, getMockRows } from "@shared/mock-data";
export interface DashboardState {
  dataByRange: Record<TimeRange, DashboardData>;
  quantByRange: Record<TimeRange, QuantData>;
  dismissedAlertIds: string[];
}
export class DashboardEntity extends Entity<DashboardState> {
  static readonly entityName = "dashboard_v2";
  static readonly initialState: DashboardState = {
    dataByRange: {
      '1M': generateDashboard('1M'),
      '3M': generateDashboard('3M'),
      '6M': generateDashboard('6M'),
      '1Y': generateDashboard('1Y'),
    },
    quantByRange: {
      '1M': generateQuantData('1M'),
      '3M': generateQuantData('3M'),
      '6M': generateQuantData('6M'),
      '1Y': generateQuantData('1Y'),
    },
    dismissedAlertIds: []
  };
  static async ensureSeed(env: Env): Promise<void> {
    const inst = new DashboardEntity(env, 'main');
    if (!(await inst.exists())) {
      const seed = JSON.parse(JSON.stringify(DashboardEntity.initialState));
      await inst.save(seed);
    }
  }
  async getRange(range: TimeRange, mode: TradingMode = 'paper'): Promise<DashboardData> {
    const state = await this.ensureState();
    let data = state.dataByRange[range] ?? generateDashboard(range);
    // Apply mode-specific jitter
    const modeData = JSON.parse(JSON.stringify(data)) as DashboardData;
    modeData.mode = mode;
    if (mode === 'paper') {
      // Simulate slightly more volatility or offset for paper mode
      modeData.kpis = modeData.kpis.map(k => ({
        ...k,
        value: k.value * 1.05,
        deltaPct: k.deltaPct * 0.8
      }));
    }
    const dismissed = state.dismissedAlertIds ?? [];
    modeData.alerts = (modeData.alerts ?? []).filter(a => !dismissed.includes(a.id));
    return modeData;
  }
  async getQuant(range: TimeRange, mode: TradingMode = 'paper'): Promise<QuantData> {
    const state = await this.ensureState();
    let data = state.quantByRange[range] ?? generateQuantData(range);
    const modeData = JSON.parse(JSON.stringify(data)) as QuantData;
    modeData.mode = mode;
    if (mode === 'paper') {
      // Paper mode offsets
      if (modeData.monteCarlo['10Y']) {
        modeData.monteCarlo['10Y'].median *= 1.1;
      }
    }
    return modeData;
  }
  async refreshRange(range: TimeRange, mode: TradingMode): Promise<DashboardData> {
    await this.mutate(state => {
      return {
        ...state,
        dataByRange: {
          ...state.dataByRange,
          [range]: { ...generateDashboard(range), updatedAt: Date.now() }
        }
      };
    });
    return this.getRange(range, mode);
  }
  async refreshQuant(range: TimeRange, mode: TradingMode): Promise<QuantData> {
    await this.mutate(state => {
      return {
        ...state,
        quantByRange: {
          ...state.quantByRange,
          [range]: { ...generateQuantData(range), updatedAt: Date.now() }
        }
      };
    });
    return this.getQuant(range, mode);
  }
  async dismissAlert(alertId: string): Promise<void> {
    await this.mutate(state => ({
      ...state,
      dismissedAlertIds: [...(state.dismissedAlertIds ?? []), alertId]
    }));
  }
}