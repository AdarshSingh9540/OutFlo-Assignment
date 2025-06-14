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
const CampaignSchema = new mongoose_1.Schema({
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
            validator: (leads) => leads.every((lead) => {
                try {
                    new URL(lead);
                    return lead.includes("linkedin.com");
                }
                catch {
                    return false;
                }
            }),
            message: "All leads must be valid LinkedIn URLs",
        },
    },
    accountIDs: {
        type: [String],
        default: [],
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
// Indexes for better query performance
CampaignSchema.index({ status: 1 });
CampaignSchema.index({ createdAt: -1 });
CampaignSchema.index({ updatedAt: -1 });
CampaignSchema.index({ name: "text", description: "text" });
// Static method to find active campaigns
CampaignSchema.statics.findActive = function () {
    return this.find({ status: { $ne: "DELETED" } }).sort({ updatedAt: -1 });
};
// Instance method to soft delete
CampaignSchema.methods.softDelete = function () {
    this.status = "DELETED";
    return this.save();
};
const Campaign = mongoose_1.default.models.Campaign || mongoose_1.default.model("Campaign", CampaignSchema);
exports.default = Campaign;
//# sourceMappingURL=Campaign.js.map