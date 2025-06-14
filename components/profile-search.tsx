"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, ExternalLink, MapPin, Building, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LinkedInProfile {
  id: string
  fullName: string
  jobTitle: string
  company: string
  location: string
  profileUrl: string
  summary?: string
  imageUrl?: string
  connectionDegree?: string
  industry?: string
  scrapedAt: string
}

interface ProfileSearchResponse {
  profiles: LinkedInProfile[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function ProfileSearch() {
  const [profiles, setProfiles] = useState<LinkedInProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async (search?: string, page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      if (search) {
        params.append("search", search)
      }

      const response = await fetch(`/api/profiles?${params}`)
      if (response.ok) {
        const data: ProfileSearchResponse = await response.json()
        setProfiles(data.profiles)
        setPagination(data.pagination)
      } else {
        throw new Error("Failed to fetch profiles")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch LinkedIn profiles",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProfiles(searchQuery, 1)
  }

  const handlePageChange = (newPage: number) => {
    fetchProfiles(searchQuery, newPage)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getConnectionColor = (degree?: string) => {
    switch (degree) {
      case "1st":
        return "bg-green-100 text-green-800"
      case "2nd":
        return "bg-blue-100 text-blue-800"
      case "3rd":
        return "bg-yellow-100 text-yellow-800"
      case "3rd+":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Profiles
          </CardTitle>
          <CardDescription>Search by name, job title, company, or location</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search profiles..."
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                fetchProfiles("", 1)
              }}
            >
              Clear
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profiles...</p>
        </div>
      ) : profiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles found</h3>
            <p className="text-gray-500">
              {searchQuery ? "Try adjusting your search terms" : "No LinkedIn profiles have been scraped yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Results Summary */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {profiles.length} of {pagination.total} profiles
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* Profile Grid */}
          <div className="grid gap-4">
            {profiles.map((profile) => (
              <Card key={profile.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                      <AvatarImage src={profile.imageUrl || "/placeholder.svg"} alt={profile.fullName} />
                      <AvatarFallback className="text-sm sm:text-lg">{getInitials(profile.fullName)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {profile.fullName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{profile.jobTitle}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Building className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">{profile.company}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">{profile.location}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {profile.connectionDegree && (
                            <Badge className={getConnectionColor(profile.connectionDegree)}>
                              {profile.connectionDegree}
                            </Badge>
                          )}
                          {profile.industry && <Badge variant="outline">{profile.industry}</Badge>}
                        </div>
                      </div>

                      {profile.summary && <p className="text-gray-600 mt-3 text-sm line-clamp-2">{profile.summary}</p>}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
                        <span className="text-xs text-gray-500">
                          Scraped: {new Date(profile.scrapedAt).toLocaleDateString()}
                        </span>
                        <Button variant="outline" size="sm" asChild className="w-fit">
                          <a
                            href={profile.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Profile
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={pagination.page === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
