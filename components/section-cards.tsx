"use client";

import { useEffect, useState } from "react";
import {
  IconTrendingUp,
  IconUsers,
  IconUserPlus,
  IconArrowUpRight,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardStats = {
  totalRevenue: string;
  revenueChange: string;
  totalMembers: number;
  membersChange: string;
  newTimers: number;
  newTimersChange: string;
  growthRate: string;
};

export function SectionCards() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: "0.00",
    revenueChange: "0%",
    totalMembers: 0,
    membersChange: "0",
    newTimers: 0,
    newTimersChange: "0",
    growthRate: "0.0%",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        const data = await response.json();
        if (data.success && data.data) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-8 w-32 bg-muted rounded mt-2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Revenue */}
      <Card className="bg-emerald-50 dark:bg-emerald-900/20">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-emerald-700 dark:text-emerald-400">
            GHS {parseFloat(stats.totalRevenue).toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="text-emerald-600 border-emerald-300 dark:border-emerald-700"
            >
              <IconTrendingUp />
              {stats.revenueChange}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium text-emerald-700 dark:text-emerald-400">
            Total contributions <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">All time revenue</div>
        </CardFooter>
      </Card>

      {/* Members */}
      <Card className="bg-sky-50 dark:bg-sky-900/20">
        <CardHeader>
          <CardDescription>Members</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-sky-700 dark:text-sky-400">
            {stats.totalMembers.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="text-sky-600 border-sky-300 dark:border-sky-700"
            >
              <IconUsers />
              {stats.membersChange}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium text-sky-700 dark:text-sky-400">
            Growing community <IconUsers className="size-4" />
          </div>
          <div className="text-muted-foreground">Active members registered</div>
        </CardFooter>
      </Card>

      {/* New Timers */}
      <Card className="bg-orange-50 dark:bg-orange-900/20">
        <CardHeader>
          <CardDescription>New Timers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-orange-700 dark:text-orange-400">
            {stats.newTimers}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="text-orange-600 border-orange-300 dark:border-orange-700"
            >
              <IconUserPlus />
              {stats.newTimersChange}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium text-orange-700 dark:text-orange-400">
            First-time participants <IconUserPlus className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Fresh engagements this month
          </div>
        </CardFooter>
      </Card>

      {/* Growth Rate */}
      <Card className="bg-violet-50 dark:bg-violet-900/20">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-violet-700 dark:text-violet-400">
            {stats.growthRate}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="text-violet-600 border-violet-300 dark:border-violet-700"
            >
              <IconArrowUpRight />
              {stats.growthRate}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium text-violet-700 dark:text-violet-400">
            Member growth <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Monthly growth rate</div>
        </CardFooter>
      </Card>
    </div>
  );
}
