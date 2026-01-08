import { Entity, Env } from "./core-utils";
import { DashboardData, TimeRange, QuantData, Alert, MetricsRow } from "@shared/types";
import { generateDashboard, generateQuantData, getMockRows } from "@shared/mock-data";
export interface DashboardState {
  dataByRange: Record<TimeRange, DashboardData>;
  quantByRange: Record<TimeRange, QuantData>;
  dismissedAlertIds: string[];
}
export class DashboardEntity extends Entity<DashboardState> {
  static readonly entityName = "dashboard";
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
  async getRange(range: TimeRange): Promise<DashboardData> {
    const state = await this.ensureState();
    const rangeData = state?.dataByRange ?? DashboardEntity.initialState.dataByRange;
    const dismissedAlertIds = state?.dismissedAlertIds ?? [];
    let data = rangeData[range];
    // Seed new fields if missing in legacy state
    if (!data) {
      data = generateDashboard(range);
    }
    if (!data.sectors) {
      data.sectors = generateDashboard(range).sectors;
    }
    if (!data.benchmarkPerformance) {
      data.benchmarkPerformance = generateDashboard(range).benchmarkPerformance;
    }
    if (!data.riskReward) {
      data.riskReward = generateDashboard(range).riskReward;
    }
    // Ensure rows are fully hydrated with metadata
    data.rows = (data.rows ?? []).map(row => {
      const fullRows = getMockRows();
      const match = fullRows.find(r => r.symbol === row.symbol);
      return {
        ...row,
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
  async getQuant(range: TimeRange): Promise<QuantData> {
    const state = await this.ensureState();
    const rangeQuant = state?.quantByRange ?? DashboardEntity.initialState.quantByRange;
    const data = rangeQuant[range] ?? generateQuantData(range);
    return JSON.parse(JSON.stringify(data)) as QuantData;
  }
  async refreshRange(range: TimeRange): Promise<DashboardData> {
    const updatedState = await this.mutate(state => {
      const newDataByRange = {
        ...state.dataByRange,
        [range]: {
          ...generateDashboard(range),
          updatedAt: Date.now()
        }
      };
      return { ...state, dataByRange: newDataByRange };
    });
    return JSON.parse(JSON.stringify(updatedState.dataByRange[range]));
  }
  async refreshQuant(range: TimeRange): Promise<QuantData> {
    const updatedState = await this.mutate(state => {
      const newQuantByRange = {
        ...state.quantByRange,
        [range]: {
          ...generateQuantData(range),
          updatedAt: Date.now()
        }
      };
      return { ...state, quantByRange: newQuantByRange };
    });
    return JSON.parse(JSON.stringify(updatedState.quantByRange[range]));
  }
}