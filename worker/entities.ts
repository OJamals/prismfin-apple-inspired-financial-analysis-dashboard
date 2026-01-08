import { Entity, Env } from "./core-utils";
import { DashboardData, TimeRange, QuantData } from "@shared/types";
import { generateDashboard, generateQuantData } from "@shared/mock-data";
export interface DashboardState {
  dataByRange: Record<TimeRange, DashboardData>;
  quantByRange: Record<TimeRange, QuantData>;
}
/**
 * DashboardEntity manages persistence for financial metrics and quantitative analysis.
 * It uses a single Durable Object instance ("main") to store all time-series data.
 */
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
  /**
   * Ensures the global dashboard state is initialized.
   */
  static async ensureSeed(env: Env): Promise<void> {
    const inst = new DashboardEntity(env, 'main');
    if (!(await inst.exists())) {
      await inst.save(DashboardEntity.initialState);
    }
  }
  /**
   * Retrieves dashboard data for a specific range with deep-copy fallback.
   */
  async getRange(range: TimeRange): Promise<DashboardData> {
    const state = await this.ensureState();
    if (!state.dataByRange || !state.dataByRange[range]) {
      return JSON.parse(JSON.stringify(generateDashboard(range)));
    }
    return JSON.parse(JSON.stringify(state.dataByRange[range]));
  }
  /**
   * Retrieves quant data for a specific range with deep-copy fallback.
   */
  async getQuant(range: TimeRange): Promise<QuantData> {
    const state = await this.ensureState();
    if (!state.quantByRange || !state.quantByRange[range]) {
      return JSON.parse(JSON.stringify(generateQuantData(range)));
    }
    return JSON.parse(JSON.stringify(state.quantByRange[range]));
  }
  /**
   * Perturbs existing dashboard data to simulate real-time market updates.
   */
  async refreshRange(range: TimeRange): Promise<DashboardData> {
    return this.mutate(state => {
      const current = state.dataByRange[range] || generateDashboard(range);
      const updatedKpis = current.kpis.map(k => ({
        ...k,
        value: k.value * (1 + (Math.random() - 0.5) * 0.02),
        deltaPct: k.deltaPct + (Math.random() - 0.5) * 0.3
      }));
      const updatedRows = current.rows.map(r => ({
        ...r,
        price: r.price * (1 + (Math.random() - 0.5) * 0.01),
        changePct: r.changePct + (Math.random() - 0.5) * 0.2
      }));
      state.dataByRange[range] = {
        ...current,
        kpis: updatedKpis,
        rows: updatedRows,
        updatedAt: Date.now()
      };
      return state;
    }).then(s => JSON.parse(JSON.stringify(s.dataByRange[range])));
  }
  /**
   * Regenerates quant simulations for the specific range.
   */
  async refreshQuant(range: TimeRange): Promise<QuantData> {
    return this.mutate(state => {
      state.quantByRange[range] = generateQuantData(range);
      return state;
    }).then(s => JSON.parse(JSON.stringify(s.quantByRange[range])));
  }
}