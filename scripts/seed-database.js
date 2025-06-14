// Database seeding script for LinkedIn Campaign Manager using Mongoose
import mongoose from "mongoose"
import Campaign from "../lib/models/Campaign.js"
import LinkedInProfile from "../lib/models/LinkedInProfile.js"

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://adarsh9540984:passwordpassword@cluster0.yju1yru.mongodb.net/"

async function seedDatabase() {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB via Mongoose")

    // Clear existing data
    await Campaign.deleteMany({})
    await LinkedInProfile.deleteMany({})
    console.log("Cleared existing data")

    // Sample LinkedIn profiles
    const sampleProfiles = [
      {
        fullName: "John Doe",
        jobTitle: "Senior Software Engineer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        profileUrl: "https://linkedin.com/in/john-doe-engineer",
        summary:
          "Experienced software engineer with 8+ years in full-stack development. Passionate about AI and machine learning technologies.",
        connectionDegree: "2nd",
        industry: "Technology",
      },
      {
        fullName: "Sarah Johnson",
        jobTitle: "Marketing Director",
        company: "InnovateCorp",
        location: "New York, NY",
        profileUrl: "https://linkedin.com/in/sarah-marketing-director",
        summary:
          "Results-driven marketing professional with expertise in digital marketing, brand strategy, and team leadership.",
        connectionDegree: "1st",
        industry: "Marketing",
      },
      {
        fullName: "Mike Chen",
        jobTitle: "Startup Founder & CEO",
        company: "StartupXYZ",
        location: "Austin, TX",
        profileUrl: "https://linkedin.com/in/mike-startup-founder",
        summary: "Serial entrepreneur with 3 successful exits. Currently building the next generation of SaaS tools.",
        connectionDegree: "3rd",
        industry: "Technology",
      },
      {
        fullName: "Emily Rodriguez",
        jobTitle: "VP of Sales",
        company: "SalesForce Solutions",
        location: "Chicago, IL",
        profileUrl: "https://linkedin.com/in/emily-vp-sales",
        summary: "Sales leader with 10+ years of experience scaling revenue teams from startup to enterprise.",
        connectionDegree: "2nd",
        industry: "Sales",
      },
      {
        fullName: "David Kim",
        jobTitle: "Product Manager",
        company: "ProductCo",
        location: "Seattle, WA",
        profileUrl: "https://linkedin.com/in/david-product-manager",
        summary: "Product management expert focused on user experience and data-driven product decisions.",
        connectionDegree: "1st",
        industry: "Technology",
      },
    ]

    // Insert sample profiles
    const insertedProfiles = await LinkedInProfile.insertMany(sampleProfiles)
    console.log(`Inserted ${insertedProfiles.length} sample LinkedIn profiles`)

    // Sample campaigns data
    const sampleCampaigns = [
      {
        name: "Tech Startup Outreach",
        description: "Targeting software engineers and CTOs at early-stage startups",
        status: "ACTIVE",
        leads: [
          "https://linkedin.com/in/john-doe-engineer",
          "https://linkedin.com/in/mike-startup-founder",
          "https://linkedin.com/in/david-product-manager",
        ],
        accountIDs: ["acc_001", "acc_002"],
      },
      {
        name: "Marketing Directors Campaign",
        description: "Reaching out to marketing directors in SaaS companies",
        status: "ACTIVE",
        leads: ["https://linkedin.com/in/sarah-marketing-director", "https://linkedin.com/in/jane-marketing-lead"],
        accountIDs: ["acc_003", "acc_004"],
      },
      {
        name: "Sales Leaders Outreach",
        description: "Targeting VP Sales and Sales Directors",
        status: "INACTIVE",
        leads: ["https://linkedin.com/in/emily-vp-sales", "https://linkedin.com/in/robert-sales-director"],
        accountIDs: ["acc_005"],
      },
      {
        name: "Product Management Network",
        description: "Building relationships with product managers in tech",
        status: "ACTIVE",
        leads: ["https://linkedin.com/in/david-product-manager", "https://linkedin.com/in/lisa-product-lead"],
        accountIDs: ["acc_006", "acc_007"],
      },
    ]

    // Insert sample campaigns
    const insertedCampaigns = await Campaign.insertMany(sampleCampaigns)
    console.log(`Inserted ${insertedCampaigns.length} sample campaigns`)

    console.log("Database seeding completed successfully!")
    console.log("Sample data includes:")
    console.log(`- ${insertedProfiles.length} LinkedIn profiles`)
    console.log(`- ${insertedCampaigns.length} campaigns`)
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

// Run the seeding function
seedDatabase()
