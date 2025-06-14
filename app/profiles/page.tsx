"use client"

import DashboardLayout from "@/components/dashboard-layout"
import ProfileSearch from "@/components/profile-search"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"

export default function ProfilesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">LinkedIn Profiles</h1>
          <p className="text-muted-foreground">Search and browse scraped LinkedIn profiles for your campaigns</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Profile Database
            </CardTitle>
            <CardDescription>
              Discover and analyze LinkedIn profiles to build targeted outreach campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileSearch />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
