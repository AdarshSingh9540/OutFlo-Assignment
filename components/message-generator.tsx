"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Copy, Wand2, User, Building, MapPin, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MessageGenerator() {
  const [loading, setLoading] = useState(false)
  const [generatedMessage, setGeneratedMessage] = useState("")
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    name: "",
    job_title: "",
    company: "",
    location: "",
    summary: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/personalized-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedMessage(data.message)
        toast({
          title: "Success",
          description: "Personalized message generated successfully!",
        })
      } else {
        throw new Error("Failed to generate message")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate personalized message",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage)
    toast({
      title: "Copied!",
      description: "Message copied to clipboard",
    })
  }

  const clearForm = () => {
    setProfileData({
      name: "",
      job_title: "",
      company: "",
      location: "",
      summary: "",
    })
    setGeneratedMessage("")
  }

  const loadSampleData = () => {
    setProfileData({
      name: "Adarsh Singh",
      job_title: "Full Stack Developer",
      company: "Outflo",
      location: "New Delhi, India",
      summary:
        "Results-driven marketing professional with 8+ years of experience in digital marketing, brand strategy, and team leadership. Proven track record of increasing brand awareness and driving revenue growth through innovative campaigns.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              LinkedIn Profile Data
            </CardTitle>
            <CardDescription>Enter the LinkedIn profile information to generate a personalized message</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="e.g., John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="job_title" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Job Title
                </Label>
                <Input
                  id="job_title"
                  value={profileData.job_title}
                  onChange={(e) => setProfileData({ ...profileData, job_title: e.target.value })}
                  placeholder="e.g., Software Engineer"
                  required
                />
              </div>

              <div>
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Company
                </Label>
                <Input
                  id="company"
                  value={profileData.company}
                  onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                  placeholder="e.g., TechCorp"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  placeholder="e.g., San Francisco, CA"
                  required
                />
              </div>

              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={profileData.summary}
                  onChange={(e) => setProfileData({ ...profileData, summary: e.target.value })}
                  placeholder="Brief professional summary from LinkedIn profile..."
                  rows={4}
                  required
                />
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Message
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={loadSampleData} className="sm:w-auto">
                  Load Sample
                </Button>
                <Button type="button" variant="outline" onClick={clearForm} className="sm:w-auto">
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Generated Message
            </CardTitle>
            <CardDescription>AI-generated personalized LinkedIn outreach message</CardDescription>
          </CardHeader>
          <CardContent>
            {generatedMessage ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Textarea
                    value={generatedMessage}
                    onChange={(e) => setGeneratedMessage(e.target.value)}
                    rows={8}
                    className="bg-transparent border-none resize-none focus:ring-0"
                    placeholder="Your personalized message will appear here..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Message
                  </Button>
                  <Button onClick={() => setGeneratedMessage("")} variant="outline">
                    Clear
                  </Button>
                </div>
                <div className="text-sm text-gray-500">Message length: {generatedMessage.length} characters</div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Wand2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>
                  Fill in the profile data and click "Generate Message" to create a personalized LinkedIn outreach
                  message.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
