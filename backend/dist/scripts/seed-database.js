"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Campaign_1 = __importDefault(require("../models/Campaign"));
const LinkedInProfile_1 = __importDefault(require("../models/LinkedInProfile"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://adarsh9540984:passwordpassword@cluster0.yju1yru.mongodb.net/";
async function seedDatabase() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log("Connected to MongoDB");
        // Clear existing data
        await Campaign_1.default.deleteMany({});
        await LinkedInProfile_1.default.deleteMany({});
        console.log("Cleared existing data");
        // Sample LinkedIn profiles
        const sampleProfiles = [
            {
                fullName: "John Doe",
                jobTitle: "Senior Software Engineer",
                company: "TechCorp Inc.",
                location: "San Francisco, CA",
                profileUrl: "https://linkedin.com/in/john-doe-engineer",
                summary: "Experienced software engineer with 8+ years in full-stack development.",
                connectionDegree: "2nd",
                industry: "Technology",
            },
            {
                fullName: "Sarah Johnson",
                jobTitle: "Marketing Director",
                company: "InnovateCorp",
                location: "New York, NY",
                profileUrl: "https://linkedin.com/in/sarah-marketing-director",
                summary: "Results-driven marketing professional with expertise in digital marketing.",
                connectionDegree: "1st",
                industry: "Marketing",
            },
            // Add more sample profiles...
        ];
        const insertedProfiles = await LinkedInProfile_1.default.insertMany(sampleProfiles);
        console.log(`Inserted ${insertedProfiles.length} sample profiles`);
        // Sample campaigns
        const sampleCampaigns = [
            {
                name: "Tech Startup Outreach",
                description: "Targeting software engineers and CTOs at early-stage startups",
                status: "ACTIVE",
                leads: ["https://linkedin.com/in/john-doe-engineer"],
                accountIDs: ["acc_001", "acc_002"],
            },
            // Add more sample campaigns...
        ];
        const insertedCampaigns = await Campaign_1.default.insertMany(sampleCampaigns);
        console.log(`Inserted ${insertedCampaigns.length} sample campaigns`);
        console.log("Database seeding completed successfully!");
    }
    catch (error) {
        console.error("Error seeding database:", error);
    }
    finally {
        await mongoose_1.default.disconnect();
    }
}
seedDatabase();
//# sourceMappingURL=seed-database.js.map