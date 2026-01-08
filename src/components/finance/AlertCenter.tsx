import React from 'react';
import { Bell, AlertTriangle, Info, Check, X, TrendingUp, Activity } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api-client';
import { Alert, TradingMode } from '@shared/types';
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
import { motion } from 'framer-motion';
import { toast } from 'sonner';
export function AlertCenter() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get('mode') as TradingMode) || 'live';
  const isLive = mode === 'live';
  const { data: alerts = [] } = useQuery<Alert[]>({
    queryKey: ['alerts', mode],
    queryFn: () => api<Alert[]>(`/api/alerts?mode=${mode}`),
    refetchInterval: isLive ? 15000 : 60000,
    enabled: typeof document !== 'undefined' ? !document.hidden : true,
  });
  const dismissMutation = useMutation({
    mutationFn: (id: string) => api('/api/alerts/dismiss', {
      method: 'POST',
      body: JSON.stringify({ id })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts', mode] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', mode] });
    }
  });
  const unreadCount = alerts.length;
  const hasHighPriority = alerts.some(a => a.priority === 'high');
  const handleDrillDown = (symbol: string) => {
    toast.info(`Analyzing signals for ${symbol}`, {
      description: "Aggregating order-book depth and technical confluence...",
    });
  };
  const getAlertIcon = (type: string, priority: string) => {
    switch(type) {
      case 'technical':
        return <TrendingUp className="size-5" />;
      case 'volatility':
        return <AlertTriangle className="size-5" />;
      case 'sentiment':
        return <Activity className="size-5" />;
      default:
        return <Info className="size-5" />;
    }
  };
  const getAlertStyles = (type: string, priority: string) => {
    if (type === 'technical' && priority === 'high') {
      return "bg-indigo-50 text-indigo-600 shadow-[0_0_15px_-3px_rgba(79,70,229,0.3)] border-indigo-100 ring-1 ring-indigo-200";
    }
    if (priority === 'high') {
      return "bg-rose-50 text-rose-600 border-rose-100 ring-1 ring-rose-200";
    }
    if (priority === 'medium') {
      return "bg-amber-50 text-amber-600 border-amber-100";
    }
    return "bg-brand-blue/5 text-brand-blue border-brand-blue/10";
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative rounded-2xl h-11 w-11 bg-card/80 border border-card/60 shadow-soft hover:shadow-md transition-all active:scale-95 group"
          aria-label={`Open alerts, ${unreadCount} items`}
        >
          <Bell className={cn("size-5 transition-colors", unreadCount > 0 ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-1 -right-1"
            >
              <Badge className={cn(
                "size-5 flex items-center justify-center p-0 border-2 border-white text-[10px] font-bold shadow-sm",
                hasHighPriority && isLive ? "bg-rose-500 animate-pulse" : "bg-brand-blue"
              )}>
                {unreadCount}
              </Badge>
            </motion.div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 border-l border-border/40 bg-card/90 backdrop-blur-3xl">
        <SheetHeader className="p-8 border-b border-border/5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <SheetTitle className="text-2xl font-bold font-display tracking-tight">Alert Intelligence</SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{mode} environment</SheetDescription>
            </div>
            <Badge variant="secondary" className="rounded-xl px-3 py-1 bg-secondary/80 text-foreground font-bold">
              {unreadCount} Signal{unreadCount !== 1 ? 's' : ''}
            </Badge>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-6 space-y-4">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="size-16 rounded-3xl bg-gain-50 text-gain-500 flex items-center justify-center mb-6 shadow-sm">
                  <Check className="size-8" />
                </div>
                <h3 className="text-lg font-bold font-display">System Neutral</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-[200px] leading-relaxed">
                  No critical volatility or technical signals detected in {mode} markets.
                </p>
              </div>
            ) : (
              alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "group relative p-5 rounded-3xl border bg-card shadow-soft transition-all hover:shadow-premium border-card/60",
                    alert.priority === 'high' ? "ring-1 ring-offset-2 ring-transparent" : ""
                  )}
                >
                  <div className="flex gap-4">
                    <div className={cn(
                      "mt-1 size-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all",
                      getAlertStyles(alert.type, alert.priority)
                    )}>
                      {getAlertIcon(alert.type, alert.priority)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                          {alert.type} • {formatDistanceToNow(alert.timestamp)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted/50"
                          onClick={() => dismissMutation.mutate(alert.id)}
                          aria-label="Dismiss alert"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                      <p className="text-sm font-bold leading-snug text-foreground">{alert.message}</p>
                      {alert.assetSymbol && (
                        <div className="pt-1 flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className="rounded-lg text-[10px] border-brand-blue/20 text-brand-blue bg-brand-blue/5 font-bold cursor-pointer hover:bg-brand-blue hover:text-white transition-all shadow-sm"
                            onClick={() => handleDrillDown(alert.assetSymbol!)}
                          >
                            Drill-Down {alert.assetSymbol}
                          </Badge>
                          {alert.type === 'technical' && (
                            <div className="size-1.5 rounded-full bg-indigo-500 animate-pulse" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}