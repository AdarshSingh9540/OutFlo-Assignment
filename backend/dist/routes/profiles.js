"use strict";
//@ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const LinkedInProfile_1 = __importDefault(require("../models/LinkedInProfile"));
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// GET /api/profiles - Fetch profiles with search and pagination
router.get("/", async (req, res) => {
    try {
        const { search, limit = "20", page = "1" } = req.query;
        const limitNum = Number.parseInt(limit);
        const pageNum = Number.parseInt(page);
        const skip = (pageNum - 1) * limitNum;
        let profiles;
        let total;
        if (search) {
            profiles = await LinkedInProfile_1.default.searchProfiles(search)
                .limit(limitNum)
                .skip(skip);
            total = await LinkedInProfile_1.default.countDocuments({
                isActive: true,
                $or: [
                    { fullName: { $regex: search, $options: "i" } },
                    { jobTitle: { $regex: search, $options: "i" } },
                    { company: { $regex: search, $options: "i" } },
                    { location: { $regex: search, $options: "i" } },
                ],
            });
        }
        else {
            profiles = await LinkedInProfile_1.default.findActive().limit(limitNum).skip(skip);
            total = await LinkedInProfile_1.default.countDocuments({ isActive: true });
        }
        res.json({
            profiles,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        console.error("Error fetching profiles:", error);
        res.status(500).json({ error: "Failed to fetch profiles" });
    }
});
// POST /api/profiles - Create new profile
router.post("/", validation_1.validateProfile, async (req, res) => {
    try {
        const profile = new LinkedInProfile_1.default(req.body);
        const savedProfile = await profile.save();
        res.status(201).json(savedProfile);
    }
    catch (error) {
        console.error("Error creating profile:", error);
        if (error.code === 11000) {
            return res.status(409).json({ error: "Profile with this URL already exists" });
        }
        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ error: "Validation failed", details: validationErrors });
        }
        res.status(500).json({ error: "Failed to create profile" });
    }
});
exports.default = router;
//# sourceMappingURL=profiles.js.map