import api from "./api"

export interface Campaign {
  id: string
  name: string
  description: string
  status: "ACTIVE" | "INACTIVE"
  leads: string[]
  accountIDs: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateCampaignData {
  name: string
  description: string
  leads: string[]
  accountIDs: string[]
}

export const campaignService = {
  // Get all campaigns
  getCampaigns: async (): Promise<Campaign[]> => {
    const response = await api.get("/campaigns")
    return response.data
  },

  // Get single campaign
  getCampaign: async (id: string): Promise<Campaign> => {
    const response = await api.get(`/campaigns/${id}`)
    return response.data
  },

  // Create campaign
  createCampaign: async (data: CreateCampaignData): Promise<Campaign> => {
    const response = await api.post("/campaigns", data)
    return response.data
  },

  // Update campaign
  updateCampaign: async (
    id: string,
    data: Partial<CreateCampaignData & { status: "ACTIVE" | "INACTIVE" }>,
  ): Promise<Campaign> => {
    const response = await api.put(`/campaigns/${id}`, data)
    return response.data
  },

  // Delete campaign
  deleteCampaign: async (id: string): Promise<void> => {
    await api.delete(`/campaigns/${id}`)
  },
}
