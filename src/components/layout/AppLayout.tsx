import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { AlertCenter } from "@/components/finance/AlertCenter";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = false, className, contentClassName }: AppLayoutProps): JSX.Element {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);
  useEffect(() => {
    setSheetOpen(false);
  }, [location.pathname]);
  const sidebarClass = 'bg-card/60 backdrop-blur-2xl border-r border-border/30 shadow-soft';
  const contentPaddingClass = cn(
    'flex-1 flex flex-col min-h-0',
    container ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 w-full' : 'w-full',
    contentClassName
  );
  if (!isMobile) {
    return (
      <div className={cn('flex h-screen overflow-hidden bg-canvas', className)}>
        <div className={cn('w-[17.5rem] h-full flex flex-col shrink-0', sidebarClass)}>
          <AppSidebar />
        </div>
        <main className="flex-1 overflow-y-auto relative flex flex-col" aria-label="Main Content">
          <header className="sticky top-0 z-30 px-8 py-5 bg-canvas/80 backdrop-blur-md border-b border-border/5 flex items-center justify-between gap-4 translate-z-0">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Unified Intelligence</span>
              <span className="text-lg font-bold font-display tracking-tight">Institutional Terminal</span>
            </div>
            <div className="flex items-center gap-4">
              <AlertCenter />
            </div>
          </header>
          <div className={contentPaddingClass}>
            {children}
          </div>
        </main>
      </div>
    );
  }
  return (
    <>
      <div className={cn('relative min-h-screen flex flex-col bg-canvas', className)}>
        <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 bg-canvas/80 backdrop-blur-md border-b border-border/10 shrink-0 translate-z-0">
          <div className="flex items-center">
            <Button
              variant='ghost'
              size='icon'
              className='-ml-2 h-10 w-10 rounded-xl hover:bg-muted/50'
              onClick={() => setSheetOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <PanelLeft className='h-5 w-5 text-muted-foreground'/>
              <span className='sr-only'>Toggle sidebar</span>
            </Button>
            <span className="ml-2 font-bold text-lg tracking-tight font-display">PrismFin</span>
          </div>
          <AlertCenter />
        </header>
        <main className="flex-1 overflow-y-auto" aria-label="Main Content">
          <div className={contentPaddingClass}>
            {children}
          </div>
        </main>
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side='left' className={cn('p-0 w-[18rem] border-r-0', sidebarClass)}>
          <SheetTitle className="sr-only">PrismFin Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Access your dashboard, financial reports, quantitative models, and application settings.
          </SheetDescription>
          <AppSidebar />
        </SheetContent>
      </Sheet>
    </>
  );
}