import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import LinkedInProfile from "@/lib/models/LinkedInProfile"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    let profiles
    let total

    if (search) {
      profiles = await LinkedInProfile.searchProfiles(search).limit(limit).skip(skip)
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
      profiles = await LinkedInProfile.findActive().limit(limit).skip(skip)
      total = await LinkedInProfile.countDocuments({ isActive: true })
    }

    return NextResponse.json({
      profiles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching profiles:", error)
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    await connectToDatabase()

    const profile = new LinkedInProfile(body)
    const savedProfile = await profile.save()

    return NextResponse.json(savedProfile, { status: 201 })
  } catch (error: any) {
    console.error("Error creating profile:", error)

    // Handle duplicate profile URL
    if (error.code === 11000) {
      return NextResponse.json({ error: "Profile with this URL already exists" }, { status: 409 })
    }

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: "Validation failed", details: validationErrors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}
