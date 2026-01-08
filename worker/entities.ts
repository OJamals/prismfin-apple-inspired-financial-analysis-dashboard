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
      // Deep clone initial state to prevent any reference contamination
      const seed = JSON.parse(JSON.stringify(DashboardEntity.initialState));
      await inst.save(seed);
    }
  }
  async getRange(range: TimeRange, mode: TradingMode): Promise<DashboardData> {
    const state = await this.ensureState();
    // Use defensive nullish coalescing to handle potential missing keys during state evolution
    const modeData = state?.dataByRange?.[mode] ?? DashboardEntity.initialState.dataByRange[mode];
    const dismissedAlertIds = state?.dismissedAlertIds ?? [];
    let data = modeData[range];
    if (!data) {
      data = generateDashboard(range, mode);
    }
    const clonedData = JSON.parse(JSON.stringify(data)) as DashboardData;
    clonedData.alerts = (clonedData.alerts ?? []).filter(a => !dismissedAlertIds.includes(a.id));
    return clonedData;
  }
  async dismissAlert(alertId: string): Promise<void> {
    await this.mutate(state => {
      const dismissed = state.dismissedAlertIds ?? [];
      if (!dismissed.includes(alertId)) {
        return {
          ...state,
          dismissedAlertIds: [...dismissed, alertId]
        };
      }
      return state;
    });
  }
  async getQuant(range: TimeRange, mode: TradingMode): Promise<QuantData> {
    const state = await this.ensureState();
    const modeQuant = state?.quantByRange?.[mode] ?? DashboardEntity.initialState.quantByRange[mode];
    const data = modeQuant[range] ?? generateQuantData(range, mode);
    return JSON.parse(JSON.stringify(data)) as QuantData;
  }
  async refreshRange(range: TimeRange, mode: TradingMode): Promise<DashboardData> {
    const updatedState = await this.mutate(state => {
      // Return fresh objects for all levels of the tree
      const newDataByRange = { ...state.dataByRange };
      const currentModeData = { ...(newDataByRange[mode] ?? DashboardEntity.initialState.dataByRange[mode]) };
      newDataByRange[mode] = {
        ...currentModeData,
        [range]: generateDashboard(range, mode)
      };
      return {
        ...state,
        dataByRange: newDataByRange
      };
    });
    return JSON.parse(JSON.stringify(updatedState.dataByRange[mode][range]));
  }
  async refreshQuant(range: TimeRange, mode: TradingMode): Promise<QuantData> {
    const updatedState = await this.mutate(state => {
      // Return fresh objects for all levels of the tree
      const newQuantByRange = { ...state.quantByRange };
      const currentModeQuant = { ...(newQuantByRange[mode] ?? DashboardEntity.initialState.quantByRange[mode]) };
      newQuantByRange[mode] = {
        ...currentModeQuant,
        [range]: generateQuantData(range, mode)
      };
      return {
        ...state,
        quantByRange: newQuantByRange
      };
    });
    return JSON.parse(JSON.stringify(updatedState.quantByRange[mode][range]));
  }
}