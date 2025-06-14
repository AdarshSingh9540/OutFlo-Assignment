import api from "./api"

export interface LinkedInProfile {
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

export interface ProfileSearchResponse {
  profiles: LinkedInProfile[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export const profileService = {
  getProfiles: async (search?: string, page = 1, limit = 20): Promise<ProfileSearchResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    const response = await api.get(`/profiles?${params}`)
    return response.data
  },

  createProfile: async (profileData: Omit<LinkedInProfile, "id" | "scrapedAt">): Promise<LinkedInProfile> => {
    const response = await api.post("/profiles", profileData)
    return response.data
  },
}
