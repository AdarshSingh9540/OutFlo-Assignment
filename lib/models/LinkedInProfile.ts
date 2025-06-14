import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ILinkedInProfile extends Document {
  fullName: string
  jobTitle: string
  company: string
  location: string
  profileUrl: string
  summary?: string
  imageUrl?: string
  connectionDegree?: string
  industry?: string
  scrapedAt: Date
  isActive: boolean
}

const LinkedInProfileSchema = new Schema<ILinkedInProfile>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [150, "Job title cannot exceed 150 characters"],
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    profileUrl: {
      type: String,
      required: [true, "Profile URL is required"],
      unique: true,
      validate: {
        validator: (url: string) => {
          try {
            new URL(url)
            return url.includes("linkedin.com")
          } catch {
            return false
          }
        },
        message: "Must be a valid LinkedIn profile URL",
      },
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [1000, "Summary cannot exceed 1000 characters"],
    },
    imageUrl: {
      type: String,
      validate: {
        validator: (url: string) => {
          if (!url) return true // Optional field
          try {
            new URL(url)
            return true
          } catch {
            return false
          }
        },
        message: "Must be a valid image URL",
      },
    },
    connectionDegree: {
      type: String,
      enum: ["1st", "2nd", "3rd", "3rd+"],
    },
    industry: {
      type: String,
      trim: true,
      maxlength: [100, "Industry cannot exceed 100 characters"],
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  },
)

// Indexes for better query performance
LinkedInProfileSchema.index({ profileUrl: 1 }, { unique: true })
LinkedInProfileSchema.index({ company: 1 })
LinkedInProfileSchema.index({ jobTitle: 1 })
LinkedInProfileSchema.index({ location: 1 })
LinkedInProfileSchema.index({ scrapedAt: -1 })
LinkedInProfileSchema.index({ isActive: 1 })
LinkedInProfileSchema.index({ fullName: "text", jobTitle: "text", company: "text" })

// Static method to find active profiles
LinkedInProfileSchema.statics.findActive = function () {
  return this.find({ isActive: true }).sort({ scrapedAt: -1 })
}

// Static method to search profiles
LinkedInProfileSchema.statics.searchProfiles = function (query: string) {
  return this.find({
    isActive: true,
    $or: [
      { fullName: { $regex: query, $options: "i" } },
      { jobTitle: { $regex: query, $options: "i" } },
      { company: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } },
    ],
  }).sort({ scrapedAt: -1 })
}

const LinkedInProfile: Model<ILinkedInProfile> =
  mongoose.models.LinkedInProfile || mongoose.model<ILinkedInProfile>("LinkedInProfile", LinkedInProfileSchema)

export default LinkedInProfile
