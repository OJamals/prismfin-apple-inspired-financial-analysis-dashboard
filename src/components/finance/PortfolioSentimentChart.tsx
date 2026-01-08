import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { generatePortfolioSentiment } from '@shared/mock-data';
export function PortfolioSentimentChart() {
  const data = generatePortfolioSentiment();
  return (
    <Card className="rounded-4xl border-none shadow-premium bg-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold font-display">Aggregate Sentiment</CardTitle>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cross-dimensional scoring</p>
      </CardHeader>
      <CardContent className="h-[300px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#f1f5f9" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
            <Radar
              name="Sentiment"
              dataKey="score"
              stroke="#0EA5E9"
              strokeWidth={3}
              fill="#0EA5E9"
              fillOpacity={0.15}
              isAnimationActive={true}
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="mt-2 text-center">
          <p className="text-[11px] font-bold text-brand-blue bg-brand-blue/5 py-1.5 px-4 rounded-xl inline-block">
            Overall Portfolio Mood: Constructive
          </p>
        </div>
      </CardContent>
    </Card>
  );
}