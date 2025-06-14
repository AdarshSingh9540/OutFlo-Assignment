import type { Request, Response, NextFunction } from "express"

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", error)

  // Default error
  let status = 500
  let message = "Internal Server Error"

  // Mongoose validation error
  if (error.name === "ValidationError") {
    status = 400
    message = "Validation Error"
  }

  // Mongoose cast error
  if (error.name === "CastError") {
    status = 400
    message = "Invalid ID format"
  }

  // Mongoose duplicate key error
  if (error.name === "MongoServerError" && (error as any).code === 11000) {
    status = 409
    message = "Duplicate entry"
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
}
