"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/member": "Members",
  "/dashboard/attendance": "Attendance",
  "/dashboard/finance": "Finance",
  "/dashboard/sms": "Bulk SMS",
};

export function SiteHeader() {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-3 lg:px-6">
        <SidebarTrigger className="-ml-1 hover:bg-accent transition-colors" />
        <Separator
          orientation="vertical"
          className="mx-2 h-6 data-[orientation=vertical]:h-6"
        />
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Manage your church community
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
