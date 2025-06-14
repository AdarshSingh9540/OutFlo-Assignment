import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Campaign, { type CreateCampaignData } from "@/lib/models/Campaign"

export async function GET() {
  try {
    await connectToDatabase()

    const campaigns = await Campaign.findActive()

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCampaignData = await request.json()

    await connectToDatabase()

    const campaign = new Campaign({
      name: body.name,
      description: body.description,
      leads: body.leads || [],
      accountIDs: body.accountIDs || [],
    })

    const savedCampaign = await campaign.save()

    return NextResponse.json(savedCampaign, { status: 201 })
  } catch (error: any) {
    console.error("Error creating campaign:", error)

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: "Validation failed", details: validationErrors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}
