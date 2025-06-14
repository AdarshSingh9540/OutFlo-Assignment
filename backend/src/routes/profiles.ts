//@ts-nocheck

import express from "express"
import LinkedInProfile from "../models/LinkedInProfile"
import { validateProfile } from "../middleware/validation"

const router = express.Router()

// GET /api/profiles - Fetch profiles with search and pagination
router.get("/", async (req, res) => {
  try {
    const { search, limit = "20", page = "1" } = req.query
    const limitNum = Number.parseInt(limit as string)
    const pageNum = Number.parseInt(page as string)
    const skip = (pageNum - 1) * limitNum

    let profiles
    let total

    if (search) {
      profiles = await LinkedInProfile.searchProfiles(search as string)
        .limit(limitNum)
        .skip(skip)
      total = await LinkedInProfile.countDocuments({
        isActive: true,
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { jobTitle: { $regex: search, $options: "i" } },
          { company: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      })
    } else {
      profiles = await LinkedInProfile.findActive().limit(limitNum).skip(skip)
      total = await LinkedInProfile.countDocuments({ isActive: true })
    }

    res.json({
      profiles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    console.error("Error fetching profiles:", error)
    res.status(500).json({ error: "Failed to fetch profiles" })
  }
})

// POST /api/profiles - Create new profile
router.post("/", validateProfile, async (req, res) => {
  try {
    const profile = new LinkedInProfile(req.body)
    const savedProfile = await profile.save()
    res.status(201).json(savedProfile)
  } catch (error: any) {
    console.error("Error creating profile:", error)

    if (error.code === 11000) {
      return res.status(409).json({ error: "Profile with this URL already exists" })
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return res.status(400).json({ error: "Validation failed", details: validationErrors })
    }

    res.status(500).json({ error: "Failed to create profile" })
  }
})

export default router
