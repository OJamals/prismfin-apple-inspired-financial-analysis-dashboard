import React from 'react';
import { Bell, AlertTriangle, Info, Check, X, TrendingUp, Activity } from 'lucide-react';
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
import { toast } from 'sonner';
export function AlertCenter() {
  const queryClient = useQueryClient();
  const { data: alerts = [], refetch } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: () => api<Alert[]>('/api/alerts'),
    refetchInterval: 30000,
    enabled: typeof document !== 'undefined' ? !document.hidden : true,
  });
  const dismissMutation = useMutation({
    mutationFn: (id: string) => api('/api/alerts/dismiss', { method: 'POST', body: JSON.stringify({ id }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
  const unreadCount = alerts.length;
  const hasHighPriority = alerts.some(a => a.priority === 'high');
  const handleDrillDown = async (symbol: string) => {
    const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: symbol }), 800));
    toast.promise(promise, {
      loading: `Synchronizing order-book for ${symbol}...`,
      success: (data: any) => `Full analytical suite loaded for ${data.name}`,
      error: 'Data retrieval timeout',
    });
  };
  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'technical': return <TrendingUp className="size-5" />;
      case 'volatility': return <AlertTriangle className="size-5" />;
      case 'sentiment': return <Activity className="size-5" />;
      default: return <Info className="size-5" />;
    }
  };
  const getAlertStyles = (type: string, priority: string) => {
    if (priority === 'high') return "bg-rose-50 text-rose-600 border-rose-100 ring-1 ring-rose-200";
    if (priority === 'medium') return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-brand-blue/5 text-brand-blue border-brand-blue/10";
  };
  return (
    <Sheet onOpenChange={(open) => open && refetch()}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-2xl h-11 w-11 bg-card/80 border border-card/60 shadow-soft hover:shadow-md transition-all active:scale-95 group" aria-label={`Open alerts, ${unreadCount} items`}>
          <Bell className={cn("size-5 transition-colors", unreadCount > 0 ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
          {unreadCount > 0 && (
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute -top-1 -right-1">
              <Badge className={cn("size-5 flex items-center justify-center p-0 border-2 border-white text-[10px] font-bold shadow-sm", hasHighPriority ? "bg-rose-500 animate-pulse" : "bg-brand-blue")}>{unreadCount}</Badge>
            </motion.div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 border-l border-border/40 bg-card/90 backdrop-blur-3xl">
        <SheetHeader className="p-8 border-b border-border/5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <SheetTitle className="text-2xl font-bold font-display tracking-tight">Alert Intelligence</SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Global Terminal</SheetDescription>
            </div>
            <Badge variant="secondary" className="rounded-xl px-3 py-1 bg-secondary/80 text-foreground font-bold">{unreadCount} Signals</Badge>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-6 space-y-4">
            <AnimatePresence initial={false}>
              {alerts.length === 0 ? (
                <motion.div key="empty-alerts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="size-16 rounded-3xl bg-gain-50 text-gain-500 flex items-center justify-center mb-6 shadow-sm"><Check className="size-8" /></div>
                  <h3 className="text-lg font-bold font-display">System Neutral</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-[200px] leading-relaxed">No critical signals detected across global indices.</p>
                </motion.div>
              ) : (
                alerts.map((alert) => (
                  <motion.div key={alert.id} layout initial={{ opacity: 0, x: 20, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }} className="group relative p-5 rounded-3xl border bg-card shadow-soft transition-all hover:shadow-premium border-card/60">
                    <div className="flex gap-4">
                      <div className={cn("mt-1 size-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all", getAlertStyles(alert.type, alert.priority))}>{getAlertIcon(alert.type)}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{alert.type} • {formatDistanceToNow(alert.timestamp)}</span>
                          <Button variant="ghost" size="icon" className="size-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted/50" onClick={() => dismissMutation.mutate(alert.id)}><X className="size-4" /></Button>
                        </div>
                        <p className="text-sm font-bold leading-snug text-foreground">{alert.message}</p>
                        {alert.assetSymbol && (<div className="pt-1 flex items-center gap-2"><Badge variant="outline" className="rounded-lg text-[10px] border-brand-blue/20 text-brand-blue bg-brand-blue/5 font-bold cursor-pointer hover:bg-brand-blue hover:text-white transition-all shadow-sm" onClick={() => handleDrillDown(alert.assetSymbol!)}>Drill-Down {alert.assetSymbol}</Badge></div>)}
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