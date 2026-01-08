import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, ShieldAlert, BarChart3, LineChart } from 'lucide-react';
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
      formula: 'St = S0 * exp((μ - σ²/2)t + σW(t))'
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
    }
  ];
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-12">
          <DashboardHeader 
            title="Educational Academy" 
            subtitle="Master the quantitative metrics powering your financial intelligence."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="rounded-4xl border-none shadow-soft hover:shadow-premium transition-all duration-300">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div className={`p-4 rounded-2xl ${course.bg}`}>
                    <course.icon className={`size-6 ${course.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold font-display">{course.title}</CardTitle>
                    <CardDescription className="text-sm font-medium">{course.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="explanation" className="border-none">
                      <AccordionTrigger className="text-xs font-bold uppercase tracking-widest text-brand-blue hover:no-underline">
                        How it works
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-2">
                        {course.content}
                        <div className="mt-4 p-4 rounded-xl bg-secondary/50 font-mono text-[10px] border border-input/40">
                          <p className="text-muted-foreground uppercase mb-2 font-bold tracking-tighter">Formula:</p>
                          <code className="text-foreground">{course.formula}</code>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="pt-2 border-t border-muted">
                    <Button asChild variant="ghost" className="w-full justify-between group rounded-xl">
                      <Link to="/quant">
                        <span className="text-xs font-bold uppercase tracking-widest">Apply in Analysis</span>
                        <TrendingUp className="size-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="rounded-4xl bg-brand-blue/5 p-12 text-center space-y-6 border border-brand-blue/10">
            <div className="size-16 rounded-3xl bg-white shadow-soft flex items-center justify-center mx-auto mb-4">
              <BookOpen className="size-8 text-brand-blue" />
            </div>
            <h2 className="text-3xl font-bold font-display tracking-tight text-foreground">Continuous Learning</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              PrismFin is designed to evolve with your trading sophistication. Our documentation is regularly updated with new institutional risk modeling techniques.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}