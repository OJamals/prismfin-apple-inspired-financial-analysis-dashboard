import React, { useState } from 'react';
import { Activity, Zap, Info, X, TrendingUp, Filter, CheckCircle2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Alert, AlertPriority } from '@shared/types';
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserSettings } from '@/hooks/use-user-settings';
export function AlertCenter() {
  const queryClient = useQueryClient();
  const { density, alertThresholds } = useUserSettings();
  const [priorityFilter, setPriorityFilter] = useState<AlertPriority | 'all'>('all');
  const { data: alerts = [], refetch, isFetching } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: () => api<Alert[]>('/api/alerts'),
    refetchInterval: 30000,
  });
  const filteredAlerts = alerts.filter(a => priorityFilter === 'all' || a.priority === priorityFilter);
  const dismissMutation = useMutation({
    mutationFn: (id: string) => api('/api/alerts/dismiss', { method: 'POST', body: JSON.stringify({ id }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    }
  });
  const hasHighPriority = alerts.some(a => a.priority === 'high');
  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'technical': return <TrendingUp className="size-5" />;
      case 'volatility': return <Zap className="size-5" />;
      case 'sentiment': return <Activity className="size-5" />;
      default: return <Info className="size-5" />;
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
          <Activity className={cn("size-5 transition-colors", alerts.length > 0 ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
          {alerts.length > 0 && (
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute -top-0.5 -right-0.5">
              <span className="relative flex h-3.5 w-3.5">
                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", hasHighPriority ? "bg-loss-500" : "bg-brand-blue")}></span>
                <span className={cn("relative inline-flex rounded-full h-3.5 w-3.5", hasHighPriority ? "bg-loss-600" : "bg-brand-blue")}></span>
              </span>
            </motion.div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 border-l border-border/40 bg-card/90 backdrop-blur-3xl">
        <SheetHeader className="p-8 border-b border-border/5">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <SheetTitle className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">
                  Signal Feed
                  {isFetching && <Activity className="size-4 animate-spin text-muted-foreground" />}
                </SheetTitle>
                <SheetDescription className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Threshold Sensitivty: {alertThresholds.volatility}% Vol</SheetDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl bg-secondary/50 h-10 w-10">
                    <Filter className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 rounded-2xl bg-card border-none shadow-premium p-2" align="end">
                  <DropdownMenuItem onClick={() => setPriorityFilter('all')} className="rounded-xl text-xs font-bold gap-2">
                    {priorityFilter === 'all' && <CheckCircle2 className="size-3 text-brand-blue" />} All Priorities
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/10" />
                  <DropdownMenuItem onClick={() => setPriorityFilter('high')} className="rounded-xl text-xs font-bold gap-2 text-loss-600">
                    {priorityFilter === 'high' && <CheckCircle2 className="size-3 text-loss-500" />} High Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter('medium')} className="rounded-xl text-xs font-bold gap-2 text-amber-600">
                    {priorityFilter === 'medium' && <CheckCircle2 className="size-3 text-amber-500" />} Medium & Above
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-6 space-y-4">
            <AnimatePresence initial={false} mode="wait">
              {filteredAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="size-16 rounded-3xl bg-secondary/30 text-muted-foreground/30 flex items-center justify-center mb-6"><Activity className="size-8" /></div>
                  <h3 className="text-lg font-bold font-display">No Signals Found</h3>
                  <p className="text-[10px] text-muted-foreground mt-2 uppercase font-black tracking-widest">Adjust filters or sensitivity</p>
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={cn(
                      "group relative rounded-3xl border bg-card shadow-soft transition-all border-white/40 mb-4 overflow-hidden",
                      density === 'compact' ? "p-3" : "p-5"
                    )}
                  >
                    <div className="flex gap-4">
                      <div className={cn(
                        "rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                        density === 'compact' ? "size-8" : "size-10",
                        alert.priority === 'high' ? "bg-loss-50 text-loss-600" : "bg-brand-blue/5 text-brand-blue"
                      )}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                            {formatDistanceToNow(alert.timestamp)} ago
                          </span>
                          <Button 
                            variant="ghost" size="icon" className="size-6 rounded-lg opacity-0 group-hover:opacity-100"
                            onClick={() => dismissMutation.mutate(alert.id)}
                          ><X className="size-3" /></Button>
                        </div>
                        <p className={cn("font-bold leading-snug text-foreground", density === 'compact' ? "text-xs" : "text-sm")}>{alert.message}</p>
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