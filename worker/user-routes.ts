import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad } from './core-utils';
import { DashboardEntity } from "./entities";
import { TimeRange } from "@shared/types";
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
}