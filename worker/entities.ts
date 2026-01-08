import { Entity } from "./core-utils";
import { DashboardData, TimeRange, QuantData } from "@shared/types";
import { generateDashboard, generateQuantData } from "@shared/mock-data";
export interface DashboardState {
  dataByRange: Record<TimeRange, DashboardData>;
  quantByRange: Record<TimeRange, QuantData>;
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
    }
  };
  static async ensureSeed(env: any): Promise<void> {
    const inst = new DashboardEntity(env, 'main');
    if (!(await inst.exists())) {
      await inst.save(DashboardEntity.initialState);
    }
  }
  async getRange(range: TimeRange): Promise<DashboardData> {
    const state = await this.ensureState();
    if (!state.dataByRange || !state.dataByRange[range]) {
      // Fallback for missing range data
      return generateDashboard(range);
    }
    return state.dataByRange[range];
  }
  async getQuant(range: TimeRange): Promise<QuantData> {
    const state = await this.ensureState();
    if (!state.quantByRange || !state.quantByRange[range]) {
      // Fallback for missing quant data
      return generateQuantData(range);
    }
    return state.quantByRange[range];
  }
  async refreshRange(range: TimeRange): Promise<DashboardData> {
    return this.mutate(state => {
      const current = state.dataByRange[range] || generateDashboard(range);
      const updatedKpis = current.kpis.map(k => ({
        ...k,
        value: k.value * (1 + (Math.random() - 0.5) * 0.015),
        deltaPct: k.deltaPct + (Math.random() - 0.5) * 0.25
      }));
      const updatedRows = current.rows.map(r => ({
        ...r,
        price: r.price * (1 + (Math.random() - 0.5) * 0.008),
        changePct: r.changePct + (Math.random() - 0.5) * 0.15
      }));
      state.dataByRange[range] = {
        ...current,
        kpis: updatedKpis,
        rows: updatedRows,
        updatedAt: Date.now()
      };
      return state;
    }).then(s => s.dataByRange[range]);
  }
  async refreshQuant(range: TimeRange): Promise<QuantData> {
    return this.mutate(state => {
      state.quantByRange[range] = generateQuantData(range);
      return state;
    }).then(s => s.quantByRange[range]);
  }
}