import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
interface SentimentGaugeProps {
  score: number;
}
export function SentimentGauge({ score }: SentimentGaugeProps) {
  // Semi-circle gauge data
  const data = [
    { name: 'Score', value: score },
    { name: 'Remainder', value: 100 - score },
  ];
  const getSentimentText = (s: number) => {
    if (s > 80) return "Ultra Bullish";
    if (s > 60) return "Bullish";
    if (s > 40) return "Neutral";
    if (s > 20) return "Bearish";
    return "Ultra Bearish";
  };
  const getSentimentColor = (s: number) => {
    if (s > 60) return "#34C759";
    if (s < 40) return "#FF3B30";
    return "#0EA5E9";
  };
  return (
    <div className="relative w-full h-[200px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="80%"
            startAngle={180}
            endAngle={0}
            innerRadius={70}
            outerRadius={95}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={getSentimentColor(score)} />
            <Cell fill="#f1f5f9" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-[20%] text-center space-y-1">
        <p className="text-4xl font-black font-display tracking-tighter tabular-nums" style={{ color: getSentimentColor(score) }}>
          {score}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {getSentimentText(score)}
        </p>
      </div>
    </div>
  );
}