import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { AcademyTopic, FinancialTerm } from '@shared/types';
import { GLOSSARY_TERMS } from '@shared/mock-data';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { AcademyTopicDetail } from '@/components/finance/AcademyTopicDetail';
import { useAcademyProgress } from '@/hooks/use-academy-progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Clock, BookOpen, ChevronRight, Zap, Search, GraduationCap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
export function AcademyPage() {
  const { data: topics = [] } = useQuery<AcademyTopic[]>({
    queryKey: ['academy'],
    queryFn: () => api<AcademyTopic[]>('/api/academy'),
  });
  const [selectedTopic, setSelectedTopic] = useState<AcademyTopic | null>(null);
  const [glossarySearch, setGlossarySearch] = useState('');
  const { getTopicProgress } = useAcademyProgress();
  const filteredGlossary = useMemo(() => {
    if (!glossarySearch) return GLOSSARY_TERMS.slice(0, 6);
    return GLOSSARY_TERMS.filter(t => 
      t.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      t.definition.toLowerCase().includes(glossarySearch.toLowerCase())
    );
  }, [glossarySearch]);
  const tracks = [
    { id: 'foundations', title: 'Foundations', icon: BookOpen, color: 'text-brand-blue', bg: 'bg-brand-blue/5' },
    { id: 'risk', title: 'Risk Management', icon: Zap, color: 'text-brand-teal', bg: 'bg-brand-teal/5' },
    { id: 'quantitative', title: 'Quantitative Lab', icon: Target, color: 'text-indigo-500', bg: 'bg-indigo-500/5' }
  ];
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-12">
          <DashboardHeader
            title="Learning Academy"
            subtitle="Bridging the gap between raw data and actionable investment intelligence."
            subtitleClassName="text-xs text-background/60 font-black uppercase tracking-widest"
          />
          {/* Global Progress Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 rounded-4xl border-none shadow-premium bg-foreground text-foreground overflow-hidden p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold font-display tracking-tight">Certification Pathway</h3>
                  <p className="text-xs text-foreground/60 font-black uppercase tracking-widest">Master Quantitative Analysis</p>
                </div>
                <GraduationCap className="size-12 text-brand-teal opacity-80" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold">Curriculum Completion</span>
                  <span className="text-2xl font-black text-brand-teal">24%</span>
                </div>
                <Progress value={24} className="h-2 bg-background/20 rounded-full" />
              </div>
            </Card>
            <Card className="rounded-4xl border-none shadow-soft bg-card p-8">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
                <Search className="size-3.5" /> Quick Glossary
              </div>
              <Input 
                placeholder="Search terms..." 
                value={glossarySearch}
                onChange={e => setGlossarySearch(e.target.value)}
                className="bg-secondary/50 border-none rounded-xl mb-6 h-10 text-xs"
              />
              <div className="space-y-3">
                {filteredGlossary.map(t => (
                  <div key={t.term} className="group cursor-help">
                    <p className="text-xs font-bold text-foreground group-hover:text-brand-blue transition-colors">{t.term}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{t.definition}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          {/* Learning Tracks */}
          <div className="space-y-16">
            {tracks.map(track => (
              <div key={track.id} className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-2xl", track.bg)}>
                    <track.icon className={cn("size-6", track.color)} />
                  </div>
                  <h2 className="text-2xl font-bold font-display tracking-tight">{track.title}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {topics.filter(t => t.trackId === track.id).map((topic, idx) => {
                    const progress = getTopicProgress(topic.id, topic.steps?.length || 0);
                    return (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedTopic(topic)}
                      >
                        <Card className="rounded-4xl border border-border/30 shadow-soft bg-card h-full cursor-pointer group-hover:shadow-premium hover:shadow-premium transition-all overflow-hidden group">
                          <CardContent className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                              <Badge className="rounded-lg px-2 py-0.5 text-[10px] font-black border-none bg-secondary/80 text-muted-foreground">
                                {topic.difficulty}
                              </Badge>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                <Clock className="size-3" />
                                {topic.readingTimeMin}m
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-xl font-bold font-display tracking-tight text-foreground group-hover:text-brand-blue transition-colors">{topic.title}</h3>
                              <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2">
                                {topic.description}
                              </p>
                            </div>
                            <div className="space-y-3 pt-4">
                              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                <span>Progress</span>
                                <span>{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} className="h-1.5 rounded-full" />
                            </div>
                            <div className="pt-4 border-t border-muted flex items-center justify-between text-brand-blue font-bold text-xs">
                              <span>Continue Learning</span>
                              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Drawer open={!!selectedTopic} onOpenChange={(open) => !open && setSelectedTopic(null)}>
        <DrawerContent className="h-[95vh] bg-canvas/95 backdrop-blur-3xl border-t border-border/20">
          <div className="max-w-6xl mx-auto w-full h-full overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              {selectedTopic && <AcademyTopicDetail topic={selectedTopic} />}
            </AnimatePresence>
          </div>
        </DrawerContent>
      </Drawer>
    </AppLayout>
  );
}