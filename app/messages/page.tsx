"use client"

import DashboardLayout from "@/components/dashboard-layout"
import MessageGenerator from "@/components/message-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquarePlus } from "lucide-react"

export default function MessagesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Message Generator</h1>
          <p className="text-muted-foreground">Generate personalized LinkedIn outreach messages using AI</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquarePlus className="h-5 w-5" />
              Personalized Message Generator
            </CardTitle>
            <CardDescription>Create compelling, personalized LinkedIn messages that get responses</CardDescription>
          </CardHeader>
          <CardContent>
            <MessageGenerator />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
