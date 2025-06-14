"use client"

import DashboardLayout from "@/components/dashboard-layout"
import CampaignDashboard from "@/components/campaign-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function CampaignsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Campaign Management</h1>
          <p className="text-muted-foreground">Create, manage, and track your LinkedIn outreach campaigns</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Campaigns
            </CardTitle>
            <CardDescription>Manage your LinkedIn outreach campaigns and track their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <CampaignDashboard />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
