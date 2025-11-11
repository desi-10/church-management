"use client";

import * as React from "react";

import {
  CalendarCheck,
  Home,
  Users,
  Wallet,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Members",
      url: "/dashboard/member",
      icon: Users,
    },
    {
      title: "Attendance",
      url: "/dashboard/attendance",
      icon: CalendarCheck,
    },
    {
      title: "Finance",
      url: "/dashboard/finance",
      icon: Wallet,
    },
    {
      title: "Bulk SMS",
      url: "/dashboard/sms",
      icon: MessageSquare,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <div>
      <Sidebar
        collapsible="offcanvas"
        {...props}
        className="border-r border-border/40 bg-gradient-to-b from-background to-muted/20"
      >
        <SidebarHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="data-[slot=sidebar-menu-button]:!p-4">
                <Link href="#" className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md group-hover:bg-primary/30 transition-colors" />
                    <Image
                      src="/logo.png"
                      alt="logo"
                      width={48}
                      height={48}
                      className="relative w-12 h-12 object-contain drop-shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      Christ Assembly
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Worldwide
                    </span>
                  </div>
                </Link>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="gap-4 px-3 py-6">
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter className="border-t border-border/40 bg-gradient-to-t from-muted/20 to-transparent p-3">
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
