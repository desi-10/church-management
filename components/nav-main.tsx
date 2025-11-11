"use client";

import type * as React from "react";
import type { Icon } from "@tabler/icons-react";
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
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Navigation Label */}
        <div className="px-3 mb-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Menu
          </p>
        </div>

        {/* Navigation Items */}
        <SidebarMenu className="space-y-1.5">
          {items.map((item) => {
            const isActive = pathname === item.url;

            return (
              <Link
                href={item.url}
                key={item.title}
                className={`
                  group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium
                  transition-all duration-300 ease-out
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30 scale-[1.02]"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98]"
                  }
                `}
              >
                {/* Active glow effect */}
                {isActive && (
                  <div className="absolute inset-0 bg-blue-400/20 rounded-xl blur-md -z-10 animate-pulse" />
                )}

                {/* Icon */}
                <div
                  className={`
                    flex items-center justify-center transition-all duration-300
                    ${isActive ? "scale-110" : "group-hover:scale-110"}
                  `}
                >
                  {item.icon && (
                    <item.icon
                      size={20}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={`
                        transition-all duration-300
                        ${
                          isActive
                            ? "text-white drop-shadow-sm"
                            : "text-gray-600 group-hover:text-gray-900"
                        }
                      `}
                    />
                  )}
                </div>

                {/* Title */}
                <span
                  className={`
                    flex-1 transition-all duration-300
                    ${isActive ? "font-semibold tracking-wide" : "font-medium"}
                  `}
                >
                  {item.title}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-sm" />
                )}

                {/* Hover shimmer effect */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-blue-100/0 to-transparent group-hover:via-blue-100/50 transition-all duration-500 -z-10" />
                )}
              </Link>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
