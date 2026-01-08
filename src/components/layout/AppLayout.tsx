import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = false, className, contentClassName }: AppLayoutProps): JSX.Element {
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);
  const sidebarClass = 'bg-card/60 backdrop-blur-xl border-r border-card/60 shadow-soft';
  const contentPaddingClass = cn(container ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12' : '', contentClassName);

  if (!isMobile) {
    return (
      <div className={cn('flex min-h-screen', className)}>
        <div className={`w-[16rem] h-screen flex flex-col shrink-0 border-r ${sidebarClass}`}>
          <AppSidebar />
        </div>
        <div className={contentPaddingClass}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn('relative min-h-screen bg-muted', className)}>
        <Button
          variant='ghost'
          size='icon'
          className='absolute left-2 top-2 z-20'
          onClick={() => setSheetOpen(true)}
        >
          <PanelLeft className='h-4 w-4'/>
          <span className='sr-only'>Toggle sidebar</span>
        </Button>
        <div className={contentPaddingClass}>
          {children}
        </div>
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side='left' className={`p-0 w-[18rem] ${sidebarClass}`}>
          <AppSidebar />
        </SheetContent>
      </Sheet>
    </>
  );
}