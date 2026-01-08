import { Entity, Env } from "./core-utils";
import { DashboardData, TimeRange, AssetClass, QuantData, Alert } from "@shared/types";
import { generateDashboard, generateQuantData } from "@shared/mock-data";
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
      await inst.save(DashboardEntity.initialState);
    }
  }
  async getRange(range: TimeRange, filter: AssetClass = 'all'): Promise<DashboardData> {
    const state = await this.ensureState();
    // Defensive check: handle cases where persistent state might be partial or corrupted
    const dataByRange = state?.dataByRange ?? DashboardEntity.initialState.dataByRange;
    const dismissedAlertIds = state?.dismissedAlertIds ?? [];
    let data = dataByRange[range];
    if (!data) {
      data = generateDashboard(range, filter);
    }
    // Server-side filtering logic
    const allRows = data?.rows ?? [];
    const filteredRows = filter === 'all' ? allRows : allRows.filter(r => r.class === filter);
    // Filter alerts based on dismissed state
    const alerts = (data?.alerts ?? []).filter(a => !dismissedAlertIds.includes(a.id));
    return {
      ...data,
      filter,
      rows: JSON.parse(JSON.stringify(filteredRows)),
      alerts: JSON.parse(JSON.stringify(alerts))
    };
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
  async getQuant(range: TimeRange): Promise<QuantData> {
    const state = await this.ensureState();
    const quantMap = state?.quantByRange ?? DashboardEntity.initialState.quantByRange;
    const data = quantMap[range] ?? generateQuantData(range);
    return JSON.parse(JSON.stringify(data));
  }
  async refreshRange(range: TimeRange): Promise<DashboardData> {
    return this.mutate(state => {
      // Ensure nested objects exist
      if (!state.dataByRange) state.dataByRange = DashboardEntity.initialState.dataByRange;
      const current = state.dataByRange[range] || generateDashboard(range);
      const updatedRows = (current?.rows ?? []).map(r => ({
        ...r,
        price: r.price * (1 + (Math.random() - 0.5) * 0.02),
        changePct: r.changePct + (Math.random() - 0.5) * 0.4,
        sentiment: Math.min(100, Math.max(0, r.sentiment + (Math.random() - 0.5) * 5))
      }));
      state.dataByRange[range] = {
        ...current,
        rows: updatedRows,
        updatedAt: Date.now()
      };
      return state;
    }).then(s => JSON.parse(JSON.stringify(s.dataByRange[range])));
  }
  async refreshQuant(range: TimeRange): Promise<QuantData> {
    return this.mutate(state => {
      if (!state.quantByRange) state.quantByRange = DashboardEntity.initialState.quantByRange;
      state.quantByRange[range] = generateQuantData(range);
      return state;
    }).then(s => JSON.parse(JSON.stringify(s.quantByRange[range])));
  }
}