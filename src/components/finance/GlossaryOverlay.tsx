import React from 'react';
import { GLOSSARY_TERMS } from '@shared/mock-data';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { BookOpen, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserSettings } from '@/hooks/use-user-settings';
interface GlossaryTermProps {
  term: string;
  children?: React.ReactNode;
  className?: string;
}
export function GlossaryTerm({ term, children, className }: GlossaryTermProps) {
  const { showTooltips } = useUserSettings();
  const definition = GLOSSARY_TERMS.find(t => t.term.toLowerCase() === term.toLowerCase());
  if (!definition || !showTooltips) {
    return <span className={className}>{children || term}</span>;
  }
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span className={cn(
          "inline-flex items-center gap-0.5 cursor-help border-b border-dotted border-brand-blue/60 hover:text-brand-blue transition-colors",
          className
        )}>
          {children || term}
          <Info className="size-3 opacity-40" />
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-6 rounded-3xl bg-card/90 backdrop-blur-xl border-white/10 shadow-premium z-[100]">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-blue/10">
              <BookOpen className="size-3.5 text-brand-blue" />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Glossary • {definition.category}</p>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-black font-display text-foreground">{definition.term}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {definition.definition}
            </p>
          </div>
          <div className="pt-3 border-t border-border/10">
            <p className="text-[9px] font-bold text-brand-blue uppercase tracking-tighter">PrismFin Intelligence Hub</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}