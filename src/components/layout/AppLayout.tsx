import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalFilter } from "@/components/finance/GlobalFilter";
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
  // Automatically close mobile sidebar on navigation
  useEffect(() => {
    setSheetOpen(false);
  }, [location.pathname]);
  const sidebarClass = 'bg-card/60 backdrop-blur-xl border-r border-card/60 shadow-soft';
  const contentPaddingClass = cn(
    'flex-1 flex flex-col min-h-0', 
    container ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 w-full' : 'w-full', 
    contentClassName
  );
  if (!isMobile) {
    return (
      <div className={cn('flex h-screen overflow-hidden bg-canvas', className)}>
        <div className={`w-[17rem] h-full flex flex-col shrink-0 border-r ${sidebarClass}`}>
          <AppSidebar />
        </div>
        <main className="flex-1 overflow-y-auto relative">
          <div className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3 bg-canvas/80 backdrop-blur-md border-b border-border/10">
             <GlobalFilter />
          </div>
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
        <header className="sticky top-0 z-20 flex items-center h-14 px-4 bg-white/80 backdrop-blur-md border-b border-border/40">
          <div className="flex items-center flex-1">
          <Button
            variant='ghost'
            size='icon'
            className='-ml-2 h-9 w-9'
            onClick={() => setSheetOpen(true)}
          >
            <PanelLeft className='h-5 w-5'/>
            <span className='sr-only'>Toggle sidebar</span>
          </Button>
          <span className="ml-3 font-semibold text-sm">PrismFin</span>
          </div>
          <AlertCenter />
        </header>
        <div className="px-4 py-2 bg-canvas/60 border-b border-border/5">
           <GlobalFilter />
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className={contentPaddingClass}>
            {children}
          </div>
        </main>
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side='left' className={`p-0 w-[18rem] ${sidebarClass}`}>
          <AppSidebar />
        </SheetContent>
      </Sheet>
    </>
  );
}