//@ts-nocheck

import express from "express"
import Campaign, { type CreateCampaignData, type UpdateCampaignData } from "../models/Campaign"
import { validateCampaign, validateCampaignUpdate } from "../middleware/validation"
import mongoose from "mongoose"

const router = express.Router()

// GET /api/campaigns - Fetch all active campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.findActive()
    res.json(campaigns)
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    res.status(500).json({ error: "Failed to fetch campaigns" })
  }
})

// GET /api/campaigns/:id - Fetch single campaign
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid campaign ID" })
    }

    const campaign = await Campaign.findOne({
      _id: id,
      status: { $ne: "DELETED" },
    })

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" })
    }

    res.json(campaign)
  } catch (error) {
    console.error("Error fetching campaign:", error)
    res.status(500).json({ error: "Failed to fetch campaign" })
  }
})

// POST /api/campaigns - Create new campaign
router.post("/", validateCampaign, async (req, res) => {
  try {
    const campaignData: CreateCampaignData = req.body

    const campaign = new Campaign({
      name: campaignData.name,
      description: campaignData.description,
      leads: campaignData.leads || [],
      accountIDs: campaignData.accountIDs || [],
    })

    const savedCampaign = await campaign.save()
    res.status(201).json(savedCampaign)
  } catch (error: any) {
    console.error("Error creating campaign:", error)

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return res.status(400).json({ error: "Validation failed", details: validationErrors })
    }

    res.status(500).json({ error: "Failed to create campaign" })
  }
})

// PUT /api/campaigns/:id - Update campaign
router.put("/:id", validateCampaignUpdate, async (req, res) => {
  try {
    const { id } = req.params
    const updateData: UpdateCampaignData = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid campaign ID" })
    }

    const campaign = await Campaign.findOneAndUpdate(
      {
        _id: id,
        status: { $ne: "DELETED" },
      },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    )

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" })
    }

    res.json(campaign)
  } catch (error: any) {
    console.error("Error updating campaign:", error)

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return res.status(400).json({ error: "Validation failed", details: validationErrors })
    }

    res.status(500).json({ error: "Failed to update campaign" })
  }
})

// DELETE /api/campaigns/:id - Soft delete campaign
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid campaign ID" })
    }

    const campaign = await Campaign.findOne({
      _id: id,
      status: { $ne: "DELETED" },
    })

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" })
    }

    await campaign.softDelete()
    res.json({ message: "Campaign deleted successfully" })
  } catch (error) {
    console.error("Error deleting campaign:", error)
    res.status(500).json({ error: "Failed to delete campaign" })
  }
})

export default router
