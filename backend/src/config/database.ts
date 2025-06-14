import mongoose from "mongoose"

const connectToDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI

    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not defined")
    }

    await mongoose.connect(mongoUri, {
      bufferCommands: false,
    })

    console.log("✅ Connected to MongoDB successfully")

    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error)
    })

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected")
    })
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error)
    process.exit(1)
  }
}

export default connectToDatabase
