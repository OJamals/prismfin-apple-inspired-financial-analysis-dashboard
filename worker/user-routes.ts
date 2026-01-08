import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad } from './core-utils';
import { DashboardEntity } from "./entities";
import { TimeRange } from "@shared/types";
import { getMockScreenerData, generateSentimentOverview, getMockAcademyTopics } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/dashboard', async (c) => {
    await DashboardEntity.ensureSeed(c.env);
    const range = (c.req.query('range') as TimeRange) || '6M';
    const entity = new DashboardEntity(c.env, 'main');
    const data = await entity.getRange(range);
    return ok(c, data);
  });
  app.post('/api/dashboard/refresh', async (c) => {
    await DashboardEntity.ensureSeed(c.env);
    const range = (c.req.query('range') as TimeRange) || '6M';
    const entity = new DashboardEntity(c.env, 'main');
    const updated = await entity.refreshRange(range);
    return ok(c, updated);
  });
  app.get('/api/screener', async (c) => {
    const data = getMockScreenerData();
    return ok(c, data);
  });
  app.get('/api/sentiment', async (c) => {
    const ticker = c.req.query('ticker') || 'AAPL';
    const data = generateSentimentOverview(ticker.toUpperCase());
    return ok(c, data);
  });
  app.get('/api/academy', async (c) => {
    const data = getMockAcademyTopics();
    return ok(c, data);
  });
  app.get('/api/quant', async (c) => {
    await DashboardEntity.ensureSeed(c.env);
    const range = (c.req.query('range') as TimeRange) || '6M';
    const entity = new DashboardEntity(c.env, 'main');
    const data = await entity.getQuant(range);
    return ok(c, data);
  });
  app.get('/api/alerts', async (c) => {
    await DashboardEntity.ensureSeed(c.env);
    const entity = new DashboardEntity(c.env, 'main');
    const data = await entity.getRange('6M');
    return ok(c, data.alerts);
  });
}