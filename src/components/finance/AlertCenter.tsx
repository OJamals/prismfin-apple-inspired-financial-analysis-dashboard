import React from 'react';
import { Activity, Zap, Info, X, TrendingUp } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Alert } from '@shared/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
export function AlertCenter() {
  const queryClient = useQueryClient();
  const { data: alerts = [], refetch, isFetching } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: () => api<Alert[]>('/api/alerts'),
    refetchInterval: 30000,
  });
  const dismissMutation = useMutation({
    mutationFn: (id: string) => api('/api/alerts/dismiss', { method: 'POST', body: JSON.stringify({ id }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    }
  });
  const unreadCount = alerts.length;
  const hasHighPriority = alerts.some(a => a.priority === 'high');
  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'technical': return <TrendingUp className="size-5" />;
      case 'volatility': return <Zap className="size-5" />;
      case 'sentiment': return <Activity className="size-5" />;
      default: return <Info className="size-5" />;
    }
  };
  const getAlertLabel = (type: string) => {
    switch(type) {
      case 'technical': return '[TECH]';
      case 'volatility': return '[VOL]';
      case 'sentiment': return '[SENT]';
      default: return '[INFO]';
    }
  };
  return (
    <Sheet onOpenChange={(open) => open && refetch()}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-2xl h-11 w-11 bg-card/80 border border-card/60 shadow-soft hover:shadow-md transition-all active:scale-95 group"
        >
          <Activity className={cn("size-5 transition-colors", unreadCount > 0 ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-0.5 -right-0.5"
            >
              <span className="relative flex h-3.5 w-3.5">
                <span className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                  hasHighPriority ? "bg-loss-500" : "bg-brand-blue"
                )}></span>
                <span className={cn(
                  "relative inline-flex rounded-full h-3.5 w-3.5",
                  hasHighPriority ? "bg-loss-600" : "bg-brand-blue"
                )}></span>
              </span>
            </motion.div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 border-l border-border/40 bg-card/90 backdrop-blur-3xl">
        <SheetHeader className="p-8 border-b border-border/5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <SheetTitle className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">
                Signal Intelligence
                {isFetching && <Activity className="size-4 animate-spin text-muted-foreground" />}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground font-black uppercase tracking-widest">Master Feed</SheetDescription>
            </div>
            <Badge variant="secondary" className="rounded-xl px-3 py-1 bg-secondary/80 text-foreground font-bold">{unreadCount} Active Signals</Badge>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-6 space-y-4">
            <AnimatePresence initial={false} mode="popLayout">
              {alerts.length === 0 ? (
                <motion.div 
                  key="empty" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex flex-col items-center justify-center py-32 text-center"
                >
                  <div className="size-16 rounded-3xl bg-gain-50 text-gain-500 flex items-center justify-center mb-6">
                    <Activity className="size-8" />
                  </div>
                  <h3 className="text-lg font-bold font-display">Feed Reconciled</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-[200px]">All critical institutional signals have been acknowledged.</p>
                </motion.div>
              ) : (
                alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="group relative p-5 rounded-3xl border bg-card shadow-soft transition-all hover:shadow-premium border-white/40 mb-4"
                  >
                    <div className="flex gap-4">
                      <div className={cn(
                        "mt-1 size-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all",
                        alert.priority === 'high' ? "bg-loss-50 text-loss-600 ring-1 ring-loss-100" : "bg-brand-blue/5 text-brand-blue"
                      )}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            <span className={cn("mr-2", alert.priority === 'high' ? "text-loss-600" : "text-brand-blue")}>
                              {getAlertLabel(alert.type)}
                            </span>
                            {formatDistanceToNow(alert.timestamp)} ago
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" 
                            onClick={() => dismissMutation.mutate(alert.id)}
                            disabled={dismissMutation.isPending}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                        <p className="text-sm font-bold leading-snug text-foreground">{alert.message}</p>
                        {alert.assetSymbol && (
                          <div className="pt-1 flex items-center gap-2">
                            <Badge variant="outline" className="rounded-lg text-[10px] border-brand-blue/20 text-brand-blue font-bold px-2 py-0.5">
                              {alert.assetSymbol} Analysis
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}