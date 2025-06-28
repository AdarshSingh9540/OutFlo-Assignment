"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Search, Shield, Database, Clock, Users } from "lucide-react"

export default function LinkedInScraperInterface() {
  const [formData, setFormData] = useState({
    keywords: "lead generation agency",
    geoUrn: "103644278", // United States
    industry: "1594,1862,80", // Marketing, Advertising, Internet
    email: "",
    password: "",
    targetCount: "25",
  })

  const [generatedUrl, setGeneratedUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generateSearchUrl = () => {
    setIsGenerating(true)

    // Simulate processing time
    setTimeout(() => {
      const baseUrl = "https://www.linkedin.com/search/results/people/"
      const params = new URLSearchParams()

      if (formData.geoUrn) {
        params.append("geoUrn", `["${formData.geoUrn}"]`)
      }

      if (formData.industry) {
        const industries = formData.industry
          .split(",")
          .map((id) => `"${id.trim()}"`)
          .join(",")
        params.append("industry", `[${industries}]`)
      }

      if (formData.keywords) {
        params.append("keywords", `"${formData.keywords}"`)
      }

      params.append("origin", "GLOBAL_SEARCH_HEADER")

      const fullUrl = `${baseUrl}?${params.toString()}`
      setGeneratedUrl(fullUrl)
      setIsGenerating(false)
    }, 1000)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const startScraping = () => {
    // This would integrate with your backend scraper
    alert("This would start the scraping process with your backend service!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">LinkedIn Profile Scraper</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Configure your search parameters to extract LinkedIn profiles with advanced filtering and human-like
            behavior simulation.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Human-like Behavior
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Database className="w-3 h-3" />
              MongoDB Storage
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Smart Delays
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              25+ Profiles
            </Badge>
          </div>
        </div>

        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Configuration
            </CardTitle>
            <CardDescription>Configure the LinkedIn search parameters for profile extraction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Keywords */}
            <div className="space-y-2">
              <Label htmlFor="keywords">Search Keywords</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => handleInputChange("keywords", e.target.value)}
                placeholder="e.g., lead generation agency, marketing consultant"
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Keywords to search for in profiles (will be wrapped in quotes for exact match)
              </p>
            </div>

            {/* Geographic URN */}
            <div className="space-y-2">
              <Label htmlFor="geoUrn">Geographic URN</Label>
              <Input
                id="geoUrn"
                value={formData.geoUrn}
                onChange={(e) => handleInputChange("geoUrn", e.target.value)}
                placeholder="103644278"
                className="w-full"
              />
              <p className="text-sm text-gray-500">LinkedIn geographic identifier (103644278 = United States)</p>
            </div>

            {/* Industry IDs */}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry IDs</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
                placeholder="1594,1862,80"
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Comma-separated industry IDs (1594=Marketing, 1862=Advertising, 80=Internet)
              </p>
            </div>

            {/* Target Count */}
            <div className="space-y-2">
              <Label htmlFor="targetCount">Target Profile Count</Label>
              <Input
                id="targetCount"
                type="number"
                value={formData.targetCount}
                onChange={(e) => handleInputChange("targetCount", e.target.value)}
                placeholder="25"
                min="1"
                max="100"
                className="w-full"
              />
              <p className="text-sm text-gray-500">Number of profiles to extract (recommended: 20-30)</p>
            </div>

            {/* Generate URL Button */}
            <Button onClick={generateSearchUrl} disabled={isGenerating || !formData.keywords} className="w-full">
              {isGenerating ? "Generating..." : "Generate Search URL"}
            </Button>
          </CardContent>
        </Card>

        {/* Generated URL Display */}
        {generatedUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Generated LinkedIn Search URL</CardTitle>
              <CardDescription>This URL will be used by the scraper to search for profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea value={generatedUrl} readOnly className="min-h-[100px] pr-12 font-mono text-sm" />
                <Button size="sm" variant="outline" onClick={copyToClipboard} className="absolute top-2 right-2">
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Credentials Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              LinkedIn Credentials
            </CardTitle>
            <CardDescription>Required for accessing LinkedIn search results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your credentials are used only for authentication and are not stored permanently. Make sure to use
                environment variables in production.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">LinkedIn Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your-email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">LinkedIn Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={startScraping}
            disabled={!generatedUrl || !formData.email || !formData.password}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Search className="w-4 h-4 mr-2" />
            Start Scraping Process
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setFormData({
                keywords: "lead generation agency",
                geoUrn: "103644278",
                industry: "1594,1862,80",
                email: "",
                password: "",
                targetCount: "25",
              })
              setGeneratedUrl("")
            }}
          >
            Reset Form
          </Button>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Smart Timing</p>
                  <p className="text-sm text-gray-500">Human-like delays between actions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">Data Storage</p>
                  <p className="text-sm text-gray-500">Automatic MongoDB integration</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium">Profile Extraction</p>
                  <p className="text-sm text-gray-500">Advanced parsing algorithms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
