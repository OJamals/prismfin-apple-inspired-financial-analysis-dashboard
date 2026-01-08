import { Entity, Env } from "./core-utils";
import { DashboardData, TimeRange, TradingMode, QuantData, Alert, MetricsRow } from "@shared/types";
import { generateDashboard, generateQuantData, getMockRows } from "@shared/mock-data";
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
      const seed = JSON.parse(JSON.stringify(DashboardEntity.initialState));
      await inst.save(seed);
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
    // Comprehensive migration and defensive field mapping
    data.rows = (data.rows ?? []).map(row => {
      const fullRows = getMockRows();
      const match = fullRows.find(r => r.symbol === row.symbol);
      return {
        ...row,
        // Ensure critical presentation fields exist
        news: row.news && row.news.length > 0 ? row.news : (match?.news ?? []),
        sentiment: row.sentiment !== undefined ? row.sentiment : (match?.sentiment ?? 50),
        miniSeries: row.miniSeries && row.miniSeries.length > 0 ? row.miniSeries : (match?.miniSeries ?? []),
        class: row.class || (match?.class ?? 'equity'),
        price: row.price || (match?.price ?? 0),
        changePct: row.changePct || (match?.changePct ?? 0),
        ytdPct: row.ytdPct || (match?.ytdPct ?? 0),
      } as MetricsRow;
    });
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