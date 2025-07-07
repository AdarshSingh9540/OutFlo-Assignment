"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// lib/models/Profile.ts
var mongoose_1 = require("mongoose");
var ProfileSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    profileUrl: { type: String, required: true, unique: true },
}, { timestamps: true });
exports.default = mongoose_1.default.models.Profile || mongoose_1.default.model("Profile", ProfileSchema);
