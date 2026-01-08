import { Entity, Env } from "./core-utils";
import { DashboardData, TimeRange, TradingMode, QuantData, Alert } from "@shared/types";
import { generateDashboard, generateQuantData } from "@shared/mock-data";
export interface DashboardState {
  dataByRange: Record<TradingMode, Record<TimeRange, DashboardData>>;
  quantByRange: Record<TradingMode, Record<TimeRange, QuantData>>;
  dismissedAlertIds: string[];
}
export class DashboardEntity extends Entity<DashboardState> {
  static readonly entityName = "dashboard";
  static readonly initialState: DashboardState = {
    dataByRange: {
      'live': {
        '1M': generateDashboard('1M', 'live'),
        '3M': generateDashboard('3M', 'live'),
        '6M': generateDashboard('6M', 'live'),
        '1Y': generateDashboard('1Y', 'live'),
      },
      'paper': {
        '1M': generateDashboard('1M', 'paper'),
        '3M': generateDashboard('3M', 'paper'),
        '6M': generateDashboard('6M', 'paper'),
        '1Y': generateDashboard('1Y', 'paper'),
      }
    },
    quantByRange: {
      'live': {
        '1M': generateQuantData('1M', 'live'),
        '3M': generateQuantData('3M', 'live'),
        '6M': generateQuantData('6M', 'live'),
        '1Y': generateQuantData('1Y', 'live'),
      },
      'paper': {
        '1M': generateQuantData('1M', 'paper'),
        '3M': generateQuantData('3M', 'paper'),
        '6M': generateQuantData('6M', 'paper'),
        '1Y': generateQuantData('1Y', 'paper'),
      }
    },
    dismissedAlertIds: []
  };
  static async ensureSeed(env: Env): Promise<void> {
    const inst = new DashboardEntity(env, 'main');
    if (!(await inst.exists())) {
      await inst.save(DashboardEntity.initialState);
    }
  }
  async getRange(range: TimeRange, mode: TradingMode): Promise<DashboardData> {
    const state = await this.ensureState();
    const modeData = state?.dataByRange?.[mode] ?? DashboardEntity.initialState.dataByRange[mode];
    const dismissedAlertIds = state?.dismissedAlertIds ?? [];
    let data = modeData[range];
    if (!data) {
      data = generateDashboard(range, mode);
    }
    // Deep clone to prevent accidental mutations of internal state
    const clonedData = JSON.parse(JSON.stringify(data)) as DashboardData;
    clonedData.alerts = (clonedData.alerts ?? []).filter(a => !dismissedAlertIds.includes(a.id));
    return clonedData;
  }
  async dismissAlert(alertId: string): Promise<void> {
    await this.mutate(state => {
      const dismissed = state.dismissedAlertIds ?? [];
      if (!dismissed.includes(alertId)) {
        state.dismissedAlertIds = [...dismissed, alertId];
      }
      return state;
    });
  }
  async getQuant(range: TimeRange, mode: TradingMode): Promise<QuantData> {
    const state = await this.ensureState();
    const modeQuant = state?.quantByRange?.[mode] ?? DashboardEntity.initialState.quantByRange[mode];
    const data = modeQuant[range] ?? generateQuantData(range, mode);
    // Deep clone decoupling
    return JSON.parse(JSON.stringify(data)) as QuantData;
  }
  async refreshRange(range: TimeRange, mode: TradingMode): Promise<DashboardData> {
    return this.mutate(state => {
      const dataByRange = state.dataByRange ?? DashboardEntity.initialState.dataByRange;
      if (!dataByRange[mode]) {
        dataByRange[mode] = DashboardEntity.initialState.dataByRange[mode];
      }
      dataByRange[mode][range] = generateDashboard(range, mode);
      state.dataByRange = dataByRange;
      return state;
    }).then(s => JSON.parse(JSON.stringify(s.dataByRange[mode][range])));
  }
  async refreshQuant(range: TimeRange, mode: TradingMode): Promise<QuantData> {
    return this.mutate(state => {
      const quantByRange = state.quantByRange ?? DashboardEntity.initialState.quantByRange;
      if (!quantByRange[mode]) {
        quantByRange[mode] = DashboardEntity.initialState.quantByRange[mode];
      }
      quantByRange[mode][range] = generateQuantData(range, mode);
      state.quantByRange = quantByRange;
      return state;
    }).then(s => JSON.parse(JSON.stringify(s.quantByRange[mode][range])));
  }
}