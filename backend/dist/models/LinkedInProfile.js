"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const LinkedInProfileSchema = new mongoose_1.Schema({
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
            validator: (url) => {
                try {
                    new URL(url);
                    return url.includes("linkedin.com");
                }
                catch {
                    return false;
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
            validator: (url) => {
                if (!url)
                    return true;
                try {
                    new URL(url);
                    return true;
                }
                catch {
                    return false;
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
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
// Indexes
LinkedInProfileSchema.index({ profileUrl: 1 }, { unique: true });
LinkedInProfileSchema.index({ company: 1 });
LinkedInProfileSchema.index({ jobTitle: 1 });
LinkedInProfileSchema.index({ location: 1 });
LinkedInProfileSchema.index({ scrapedAt: -1 });
LinkedInProfileSchema.index({ isActive: 1 });
// Static methods
LinkedInProfileSchema.statics.findActive = function () {
    return this.find({ isActive: true }).sort({ scrapedAt: -1 });
};
LinkedInProfileSchema.statics.searchProfiles = function (query) {
    return this.find({
        isActive: true,
        $or: [
            { fullName: { $regex: query, $options: "i" } },
            { jobTitle: { $regex: query, $options: "i" } },
            { company: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } },
        ],
    }).sort({ scrapedAt: -1 });
};
const LinkedInProfile = mongoose_1.default.models.LinkedInProfile || mongoose_1.default.model("LinkedInProfile", LinkedInProfileSchema);
exports.default = LinkedInProfile;
//# sourceMappingURL=LinkedInProfile.js.map