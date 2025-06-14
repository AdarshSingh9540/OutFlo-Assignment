import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import connectToDatabase from "@/lib/mongodb"
import Campaign, { type UpdateCampaignData } from "@/lib/models/Campaign"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid campaign ID" }, { status: 400 })
    }

    const campaign = await Campaign.findOne({
      _id: params.id,
      status: { $ne: "DELETED" },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json(campaign)
  } catch (error) {
    console.error("Error fetching campaign:", error)
    return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body: UpdateCampaignData = await request.json()

    await connectToDatabase()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid campaign ID" }, { status: 400 })
    }

    const campaign = await Campaign.findOneAndUpdate(
      {
        _id: params.id,
        status: { $ne: "DELETED" },
      },
      body,
      {
        new: true,
        runValidators: true,
      },
    )

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json(campaign)
  } catch (error: any) {
    console.error("Error updating campaign:", error)

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: "Validation failed", details: validationErrors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid campaign ID" }, { status: 400 })
    }

    const campaign = await Campaign.findOne({
      _id: params.id,
      status: { $ne: "DELETED" },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Use the instance method for soft delete
    await campaign.softDelete()

    return NextResponse.json({ message: "Campaign deleted successfully" })
  } catch (error) {
    console.error("Error deleting campaign:", error)
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 })
  }
}
