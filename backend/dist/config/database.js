"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectToDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }
        await mongoose_1.default.connect(mongoUri, {
            bufferCommands: false,
        });
        console.log("✅ Connected to MongoDB successfully");
        mongoose_1.default.connection.on("error", (error) => {
            console.error("❌ MongoDB connection error:", error);
        });
        mongoose_1.default.connection.on("disconnected", () => {
            console.log("⚠️ MongoDB disconnected");
        });
    }
    catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};
exports.default = connectToDatabase;
//# sourceMappingURL=database.js.map