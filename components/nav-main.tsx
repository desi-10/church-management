"use client";

import * as React from "react";
import { type Icon } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?:
      | Icon
      | React.ComponentType<{
          size?: number;
          strokeWidth?: number;
          className?: string;
        }>;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1">
        <div className="px-3 mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Navigation
          </p>
        </div>
        <SidebarMenu className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.url;

            return (
              <Link
                href={item.url}
                key={item.title}
                className={`
                   relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                  transition-all duration-200 ease-in-out
                  ${
                    isActive
                      ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm shadow-primary/10"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
                <div
                  className={`
                  transition-transform duration-200
                  ${isActive ? "scale-110" : ""}
                `}
                >
                  {item.icon && (
                    <item.icon
                      size={20}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={`
                        transition-all duration-200
                        ${isActive ? "text-primary" : "text-muted-foreground"}
                      `}
                    />
                  )}
                </div>
                <span
                  className={`
                  transition-all duration-200
                  ${isActive ? "font-semibold" : "font-medium"}
                `}
                >
                  {item.title}
                </span>
                {/* Hover effect */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-lg bg-primary/0 group-hover:bg-primary/5 transition-colors duration-200 -z-10" />
                )}
              </Link>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
