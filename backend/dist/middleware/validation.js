"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProfile = exports.validateMessageRequest = exports.validateCampaignUpdate = exports.validateCampaign = void 0;
const joi_1 = __importDefault(require("joi"));
const campaignSchema = joi_1.default.object({
    name: joi_1.default.string().required().max(100).trim(),
    description: joi_1.default.string().required().max(500).trim(),
    leads: joi_1.default.array().items(joi_1.default.string().uri()).default([]),
    accountIDs: joi_1.default.array().items(joi_1.default.string()).default([]),
});
const campaignUpdateSchema = joi_1.default.object({
    name: joi_1.default.string().max(100).trim(),
    description: joi_1.default.string().max(500).trim(),
    leads: joi_1.default.array().items(joi_1.default.string().uri()),
    accountIDs: joi_1.default.array().items(joi_1.default.string()),
    status: joi_1.default.string().valid("ACTIVE", "INACTIVE"),
});
const messageSchema = joi_1.default.object({
    name: joi_1.default.string().required().trim(),
    job_title: joi_1.default.string().required().trim(),
    company: joi_1.default.string().required().trim(),
    location: joi_1.default.string().required().trim(),
    summary: joi_1.default.string().required().trim(),
});
const profileSchema = joi_1.default.object({
    fullName: joi_1.default.string().required().max(100).trim(),
    jobTitle: joi_1.default.string().required().max(150).trim(),
    company: joi_1.default.string().required().max(100).trim(),
    location: joi_1.default.string().required().max(100).trim(),
    profileUrl: joi_1.default.string().required().uri(),
    summary: joi_1.default.string().max(1000).trim(),
    imageUrl: joi_1.default.string().uri(),
    connectionDegree: joi_1.default.string().valid("1st", "2nd", "3rd", "3rd+"),
    industry: joi_1.default.string().max(100).trim(),
});
const validateCampaign = (req, res, next) => {
    const { error } = campaignSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
exports.validateCampaign = validateCampaign;
const validateCampaignUpdate = (req, res, next) => {
    const { error } = campaignUpdateSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
exports.validateCampaignUpdate = validateCampaignUpdate;
const validateMessageRequest = (req, res, next) => {
    const { error } = messageSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
exports.validateMessageRequest = validateMessageRequest;
const validateProfile = (req, res, next) => {
    const { error } = profileSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
exports.validateProfile = validateProfile;
//# sourceMappingURL=validation.js.map