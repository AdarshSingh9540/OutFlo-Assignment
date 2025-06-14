import api from "./api"

export interface ProfileData {
  name: string
  job_title: string
  company: string
  location: string
  summary: string
}

export interface MessageResponse {
  message: string
  note?: string
}

export const messageService = {
  generateMessage: async (profileData: ProfileData): Promise<MessageResponse> => {
    const response = await api.post("/personalized-message", profileData)
    return response.data
  },
}
