import React from 'react';
import { Bell, AlertTriangle, Info, Check, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Alert } from '@shared/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
export function AlertCenter() {
  const queryClient = useQueryClient();
  const { data: alerts = [] } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: () => api<Alert[]>('/api/alerts'),
    refetchInterval: 30000,
  });
  const dismissMutation = useMutation({
    mutationFn: (id: string) => api('/api/alerts/dismiss', { 
      method: 'POST', 
      body: JSON.stringify({ id }) 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
  const unreadCount = alerts.length;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl h-10 w-10 bg-card shadow-soft hover:bg-muted">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 bg-rose-500 border-2 border-white text-[10px] font-bold">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 border-l border-white/40 bg-white/80 backdrop-blur-2xl">
        <SheetHeader className="p-6 border-b border-border/40">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold font-display">Alert Center</SheetTitle>
            <Badge variant="secondary" className="rounded-lg">{unreadCount} Active</Badge>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4 space-y-3">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="size-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
                  <Check className="size-6" />
                </div>
                <p className="text-sm font-semibold">All clear!</p>
                <p className="text-xs text-muted-foreground mt-1">No pending alerts for your portfolio.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={cn(
                    "group relative p-4 rounded-2xl border bg-white shadow-soft transition-all hover:shadow-md",
                    alert.priority === 'high' ? "border-l-4 border-l-rose-500" : 
                    alert.priority === 'medium' ? "border-l-4 border-l-amber-500" : "border-l-4 border-l-brand-blue"
                  )}
                >
                  <div className="flex gap-3">
                    <div className={cn(
                      "mt-0.5 size-8 rounded-xl flex items-center justify-center shrink-0",
                      alert.priority === 'high' ? "bg-rose-50 text-rose-600" : "bg-muted text-muted-foreground"
                    )}>
                      {alert.type === 'volatility' ? <AlertTriangle className="size-4" /> : <Info className="size-4" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {alert.type} • {formatDistanceToNow(alert.timestamp)} ago
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => dismissMutation.mutate(alert.id)}
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-semibold leading-tight">{alert.message}</p>
                      {alert.assetSymbol && (
                        <Button variant="link" className="p-0 h-auto text-xs text-brand-blue font-bold">
                          Analyze {alert.assetSymbol}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}