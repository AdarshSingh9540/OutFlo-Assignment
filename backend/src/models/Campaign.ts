import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ICampaign extends Document {
  name: string
  description: string
  status: "ACTIVE" | "INACTIVE" | "DELETED"
  leads: string[]
  accountIDs: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateCampaignData {
  name: string
  description: string
  leads: string[]
  accountIDs: string[]
}

export interface UpdateCampaignData extends Partial<CreateCampaignData> {
  status?: "ACTIVE" | "INACTIVE"
}

const CampaignSchema = new Schema<ICampaign>(
  {
    name: {
      type: String,
      required: [true, "Campaign name is required"],
      trim: true,
      maxlength: [100, "Campaign name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Campaign description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "INACTIVE", "DELETED"],
        message: "Status must be ACTIVE, INACTIVE, or DELETED",
      },
      default: "ACTIVE",
    },
    leads: {
      type: [String],
      default: [],
      validate: {
        validator: (leads: string[]) =>
          leads.every((lead) => {
            try {
              new URL(lead)
              return lead.includes("linkedin.com")
            } catch {
              return false
            }
          }),
        message: "All leads must be valid LinkedIn URLs",
      },
    },
    accountIDs: {
      type: [String],
      default: [],
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
CampaignSchema.index({ status: 1 })
CampaignSchema.index({ createdAt: -1 })
CampaignSchema.index({ updatedAt: -1 })
CampaignSchema.index({ name: "text", description: "text" })

// Static method to find active campaigns
CampaignSchema.statics.findActive = function () {
  return this.find({ status: { $ne: "DELETED" } }).sort({ updatedAt: -1 })
}

// Instance method to soft delete
CampaignSchema.methods.softDelete = function () {
  this.status = "DELETED"
  return this.save()
}

const Campaign: Model<ICampaign> = mongoose.models.Campaign || mongoose.model<ICampaign>("Campaign", CampaignSchema)

export default Campaign
