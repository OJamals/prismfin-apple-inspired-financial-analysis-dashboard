import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { InteractiveAcademyChart } from '@/components/finance/InteractiveAcademyChart';
import { BookOpen, TrendingUp, ShieldAlert, BarChart3, LineChart, Scale, Layers } from 'lucide-react';
export function AcademyPage() {
  const courses = [
    {
      id: 'sharpe',
      title: 'Sharpe Ratio',
      description: 'Understanding risk-adjusted returns.',
      icon: TrendingUp,
      color: 'text-brand-teal',
      bg: 'bg-brand-teal/10',
      content: 'The Sharpe Ratio measures the performance of an investment compared to a risk-free asset, after adjusting for its risk. A higher Sharpe Ratio indicates better risk-adjusted returns.',
      formula: '(Portfolio Return - Risk-Free Rate) / Portfolio Standard Deviation'
    },
    {
      id: 'beta',
      title: 'Portfolio Beta',
      description: 'Measuring market sensitivity.',
      icon: LineChart,
      color: 'text-brand-blue',
      bg: 'bg-brand-blue/10',
      content: 'Beta measures a portfolio\'s volatility in relation to the overall market (usually S&P 500). A beta of 1.0 means the portfolio moves exactly with the market.',
      formula: 'Covariance(Portfolio, Market) / Variance(Market)'
    },
    {
      id: 'monte-carlo',
      title: 'Monte Carlo Simulation',
      description: 'Probabilistic future projections.',
      icon: BarChart3,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      content: 'Monte Carlo simulations use repeated random sampling to project thousands of possible future price paths based on historical volatility and drift.',
      formula: 'St = S0 * exp((μ - σ��/2)t + σW(t))'
    },
    {
      id: 'drawdown',
      title: 'Max Drawdown',
      description: 'Evaluating peak-to-trough decline.',
      icon: ShieldAlert,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      content: 'Maximum Drawdown (MDD) is the maximum observed loss from a peak to a trough of a portfolio, before a new peak is attained.',
      formula: '(Trough Value - Peak Value) / Peak Value'
    },
    {
      id: 'correlation',
      title: 'Correlation Matrix',
      description: 'Diversification through movement math.',
      icon: Scale,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
      content: 'Correlation coefficients range from -1 to 1. Assets with negative correlation are ideal diversifiers as they tend to move in opposite directions.',
      formula: 'ρ(X,Y) = Cov(X,Y) / [σX * σY]'
    },
    {
      id: 'alpha-beta',
      title: 'Alpha Attribution',
      description: 'Excess return over benchmark.',
      icon: Layers,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      content: 'Alpha represents the value a manager or strategy adds above the market return. It is the "skill" component of your portfolio performance.',
      formula: 'Alpha = Actual Return - [Rf + β * (Rm - Rf)]'
    }
  ];
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-16">
          <DashboardHeader
            title="Educational Academy"
            subtitle="Master the institutional quantitative metrics powering your financial intelligence."
          />
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-brand-blue/10 flex items-center justify-center">
                <Layers className="size-5 text-brand-blue" />
              </div>
              <h2 className="text-2xl font-bold font-display tracking-tight">Interactive Quant Lab</h2>
            </div>
            <InteractiveAcademyChart />
          </section>
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <BookOpen className="size-5 text-indigo-500" />
              </div>
              <h2 className="text-2xl font-bold font-display tracking-tight">Core Modules</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card key={course.id} className="rounded-4xl border-none shadow-soft hover:shadow-premium transition-all duration-500 group">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${course.bg}`}>
                      <course.icon className={`size-6 ${course.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold font-display">{course.title}</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest mt-1 opacity-60">{course.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="explanation" className="border-none">
                        <AccordionTrigger className="text-[10px] font-bold uppercase tracking-widest text-brand-blue hover:no-underline">
                          Concept Breakdown
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-2">
                          {course.content}
                          <div className="mt-4 p-4 rounded-xl bg-secondary/50 font-mono text-[9px] border border-input/20">
                            <p className="text-[10px] text-muted-foreground uppercase mb-2 font-bold tracking-tighter">Formula:</p>
                            <code className="text-foreground">{course.formula}</code>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          <div className="rounded-[3rem] bg-card p-12 text-center space-y-6 border border-white/40 shadow-soft">
            <div className="size-16 rounded-3xl bg-brand-blue/10 text-brand-blue flex items-center justify-center mx-auto mb-4">
              <BookOpen className="size-8" />
            </div>
            <h2 className="text-3xl font-bold font-display tracking-tight text-foreground">Continuous Intelligence</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              PrismFin's academy evolves with the markets. New proprietary modules on Synthetic Volatility and Drawdown Correlation are added quarterly for Pro subscribers.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}