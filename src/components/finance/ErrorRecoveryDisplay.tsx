import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
interface ErrorRecoveryDisplayProps {
  onRetry: () => void;
  isRetrying?: boolean;
}
export function ErrorRecoveryDisplay({ onRetry, isRetrying }: ErrorRecoveryDisplayProps) {
  const steps = [
    { id: 1, label: 'Verify API Handshake', status: 'complete' },
    { id: 2, label: 'Synchronizing Durable Object', status: 'pending' },
    { id: 3, label: 'Hydrating Analytical Models', status: 'idle' }
  ];
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        <Card className="rounded-5xl border-none shadow-premium bg-card overflow-hidden">
          <div className="p-10 md:p-14 text-center space-y-8">
            <div className="size-20 rounded-3xl bg-loss-50 text-loss-500 flex items-center justify-center mx-auto shadow-sm ring-1 ring-loss-100">
              <AlertCircle className="size-10" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold font-display tracking-tight">Data Link Failed</h2>
              <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                We encountered a disruption in the institutional data feed. The terminal is attempting to reconcile the connection.
              </p>
            </div>
            <div className="bg-secondary/30 rounded-3xl p-6 space-y-4 text-left border border-border/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Troubleshooting Protocols</p>
              <div className="space-y-3">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center justify-between text-sm">
                    <span className="font-bold text-foreground/80">{step.label}</span>
                    {step.status === 'complete' ? (
                      <CheckCircle2 className="size-4 text-brand-teal" />
                    ) : step.status === 'pending' ? (
                      <Loader2 className="size-4 text-brand-blue animate-spin" />
                    ) : (
                      <div className="size-4 rounded-full border-2 border-muted" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Button
              onClick={onRetry}
              disabled={isRetrying}
              className="w-full h-14 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-xs shadow-lg hover:scale-[1.02] transition-transform active:scale-95"
            >
              {isRetrying ? <RefreshCw className="size-4 animate-spin mr-2" /> : null}
              Reconnect Terminal Feed
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}