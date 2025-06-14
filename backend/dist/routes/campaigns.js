"use strict";
//@ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Campaign_1 = __importDefault(require("../models/Campaign"));
const validation_1 = require("../middleware/validation");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
// GET /api/campaigns - Fetch all active campaigns
router.get("/", async (req, res) => {
    try {
        const campaigns = await Campaign_1.default.findActive();
        res.json(campaigns);
    }
    catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).json({ error: "Failed to fetch campaigns" });
    }
});
// GET /api/campaigns/:id - Fetch single campaign
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid campaign ID" });
        }
        const campaign = await Campaign_1.default.findOne({
            _id: id,
            status: { $ne: "DELETED" },
        });
        if (!campaign) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        res.json(campaign);
    }
    catch (error) {
        console.error("Error fetching campaign:", error);
        res.status(500).json({ error: "Failed to fetch campaign" });
    }
});
// POST /api/campaigns - Create new campaign
router.post("/", validation_1.validateCampaign, async (req, res) => {
    try {
        const campaignData = req.body;
        const campaign = new Campaign_1.default({
            name: campaignData.name,
            description: campaignData.description,
            leads: campaignData.leads || [],
            accountIDs: campaignData.accountIDs || [],
        });
        const savedCampaign = await campaign.save();
        res.status(201).json(savedCampaign);
    }
    catch (error) {
        console.error("Error creating campaign:", error);
        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ error: "Validation failed", details: validationErrors });
        }
        res.status(500).json({ error: "Failed to create campaign" });
    }
});
// PUT /api/campaigns/:id - Update campaign
router.put("/:id", validation_1.validateCampaignUpdate, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid campaign ID" });
        }
        const campaign = await Campaign_1.default.findOneAndUpdate({
            _id: id,
            status: { $ne: "DELETED" },
        }, updateData, {
            new: true,
            runValidators: true,
        });
        if (!campaign) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        res.json(campaign);
    }
    catch (error) {
        console.error("Error updating campaign:", error);
        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ error: "Validation failed", details: validationErrors });
        }
        res.status(500).json({ error: "Failed to update campaign" });
    }
});
// DELETE /api/campaigns/:id - Soft delete campaign
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid campaign ID" });
        }
        const campaign = await Campaign_1.default.findOne({
            _id: id,
            status: { $ne: "DELETED" },
        });
        if (!campaign) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        await campaign.softDelete();
        res.json({ message: "Campaign deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting campaign:", error);
        res.status(500).json({ error: "Failed to delete campaign" });
    }
});
exports.default = router;
//# sourceMappingURL=campaigns.js.map