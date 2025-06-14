"use client";

import DashboardLayout from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  MessageSquarePlus,
  Search,
  TrendingUp,
  Activity,
  PlayIcon as Campaign,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    {
      title: "Active Campaigns",
      value: "12",
      description: "3 new this week",
      icon: Campaign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Messages Generated",
      value: "248",
      description: "+12% from last month",
      icon: MessageSquarePlus,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Profiles Scraped",
      value: "1,429",
      description: "Updated 2 hours ago",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Response Rate",
      value: "24.5%",
      description: "+2.1% from last week",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const quickActions = [
    {
      title: "Create New Campaign",
      description: "Set up a new LinkedIn outreach campaign",
      href: "/campaigns",
      icon: Campaign,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Generate Message",
      description: "Create AI-powered personalized messages",
      href: "/messages",
      icon: MessageSquarePlus,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Search Profiles",
      description: "Browse and search LinkedIn profiles",
      href: "/profiles",
      icon: Search,
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your LinkedIn automation
            activities.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="group hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg text-white ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full group-hover:bg-primary/90">
                  <Link href={action.href} className="flex items-center gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest LinkedIn automation activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Campaign Created",
                  description: "Tech Startup Outreach campaign was created",
                  time: "2 hours ago",
                  status: "success",
                },
                {
                  action: "Messages Generated",
                  description:
                    "15 personalized messages generated for Marketing Directors",
                  time: "4 hours ago",
                  status: "success",
                },
                {
                  action: "Profiles Scraped",
                  description: "25 new LinkedIn profiles added to database",
                  time: "6 hours ago",
                  status: "info",
                },
                {
                  action: "Campaign Updated",
                  description:
                    "Sales Leaders Outreach status changed to Active",
                  time: "1 day ago",
                  status: "warning",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 pb-3 border-b last:border-b-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === "success"
                        ? "bg-green-500"
                        : activity.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
