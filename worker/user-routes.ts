import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad } from './core-utils';
import { DashboardEntity } from "./entities";
import { TimeRange, TradingMode } from "@shared/types";
import { generateScreenerStocks, generateMarketIntelligence } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/dashboard', async (c) => {
    await DashboardEntity.ensureSeed(c.env);
    const range = (c.req.query('range') as TimeRange) || '6M';
    const mode = (c.req.query('mode') as TradingMode) || 'live';
    const entity = new DashboardEntity(c.env, 'main');
    const data = await entity.getRange(range, mode);
    return ok(c, data);
  });
  app.post('/api/dashboard/refresh', async (c) => {
    await DashboardEntity.ensureSeed(c.env);
    const range = (c.req.query('range') as TimeRange) || '6M';
    const mode = (c.req.query('mode') as TradingMode) || 'live';
    const entity = new DashboardEntity(c.env, 'main');
    const updated = await entity.refreshRange(range, mode);
    return ok(c, updated);
  });
  app.get('/api/alerts', async (c) => {
    await DashboardEntity.ensureSeed(c.env);
    const range = (c.req.query('range') as TimeRange) || '6M';
    const mode = (c.req.query('mode') as TradingMode) || 'live';
    const entity = new DashboardEntity(c.env, 'main');
    const data = await entity.getRange(range, mode);
    return ok(c, data.alerts);
  });
  app.post('/api/alerts/dismiss', async (c) => {
    const { id } = await c.req.json();
    if (!id) return bad(c, 'Alert ID required');
    const entity = new DashboardEntity(c.env, 'main');
    await entity.dismissAlert(id);
    return ok(c, { dismissed: id });
  });
  app.get('/api/quant', async (c) => {
    await DashboardEntity.ensureSeed(c.env);
    const range = (c.req.query('range') as TimeRange) || '6M';
    const mode = (c.req.query('mode') as TradingMode) || 'live';
    const entity = new DashboardEntity(c.env, 'main');
    const data = await entity.getQuant(range, mode);
    return ok(c, data);
  });
  app.post('/api/quant/refresh', async (c) => {
    await DashboardEntity.ensureSeed(c.env);
    const range = (c.req.query('range') as TimeRange) || '6M';
    const mode = (c.req.query('mode') as TradingMode) || 'live';
    const entity = new DashboardEntity(c.env, 'main');
    const updated = await entity.refreshQuant(range, mode);
    return ok(c, updated);
  });
  /** Phase 11 Routes **/
  app.get('/api/screener', async (c) => {
    const peMax = parseFloat(c.req.query('peMax') || '100');
    const yieldMin = parseFloat(c.req.query('yieldMin') || '0');
    const rsiMin = parseFloat(c.req.query('rsiMin') || '0');
    let stocks = generateScreenerStocks();
    // Apply basic filters
    stocks = stocks.filter(s => 
      s.peRatio <= peMax && 
      s.divYield >= yieldMin && 
      s.rsi >= rsiMin
    );
    return ok(c, stocks);
  });
  app.get('/api/news', async (c) => {
    const symbol = (c.req.query('symbol') || 'AAPL').toUpperCase();
    const data = generateMarketIntelligence(symbol);
    return ok(c, data);
  });
}