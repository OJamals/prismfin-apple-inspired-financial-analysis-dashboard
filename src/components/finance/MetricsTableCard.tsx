import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricsRow } from '@shared/types';
import { formatCurrencyUSD, formatPct } from '@/lib/format';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
interface MetricsTableCardProps {
  rows: MetricsRow[];
}
export function MetricsTableCard({ rows }: MetricsTableCardProps) {
  return (
    <Card className="rounded-4xl border-none shadow-soft bg-card overflow-hidden">
      <CardHeader className="px-8 pt-8">
        <CardTitle className="text-xl font-semibold">Top Positions</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-8">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Asset</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Price</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Change</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">YTD</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.symbol} className="border-none group hover:bg-muted/40 transition-colors">
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{row.name}</span>
                    <span className="text-xs text-muted-foreground uppercase">{row.symbol}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">{formatCurrencyUSD(row.price)}</TableCell>
                <TableCell className="text-right">
                  <div className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tabular-nums ml-auto",
                    row.changePct >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                  )}>
                    {row.changePct >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {formatPct(row.changePct)}
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                   <span className={cn(row.ytdPct >= 0 ? "text-emerald-600" : "text-rose-600")}>
                    {formatPct(row.ytdPct)}
                   </span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground tabular-nums">{row.volume}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}