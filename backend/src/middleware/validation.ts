import type { Request, Response, NextFunction } from "express"
import Joi from "joi"

const campaignSchema = Joi.object({
  name: Joi.string().required().max(100).trim(),
  description: Joi.string().required().max(500).trim(),
  leads: Joi.array().items(Joi.string().uri()).default([]),
  accountIDs: Joi.array().items(Joi.string()).default([]),
})

const campaignUpdateSchema = Joi.object({
  name: Joi.string().max(100).trim(),
  description: Joi.string().max(500).trim(),
  leads: Joi.array().items(Joi.string().uri()),
  accountIDs: Joi.array().items(Joi.string()),
  status: Joi.string().valid("ACTIVE", "INACTIVE"),
})

const messageSchema = Joi.object({
  name: Joi.string().required().trim(),
  job_title: Joi.string().required().trim(),
  company: Joi.string().required().trim(),
  location: Joi.string().required().trim(),
  summary: Joi.string().required().trim(),
})

const profileSchema = Joi.object({
  fullName: Joi.string().required().max(100).trim(),
  jobTitle: Joi.string().required().max(150).trim(),
  company: Joi.string().required().max(100).trim(),
  location: Joi.string().required().max(100).trim(),
  profileUrl: Joi.string().required().uri(),
  summary: Joi.string().max(1000).trim(),
  imageUrl: Joi.string().uri(),
  connectionDegree: Joi.string().valid("1st", "2nd", "3rd", "3rd+"),
  industry: Joi.string().max(100).trim(),
})

export const validateCampaign = (req: Request, res: Response, next: NextFunction) => {
  const { error } = campaignSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }
  next()
}

export const validateCampaignUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { error } = campaignUpdateSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }
  next()
}

export const validateMessageRequest = (req: Request, res: Response, next: NextFunction) => {
  const { error } = messageSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }
  next()
}

export const validateProfile = (req: Request, res: Response, next: NextFunction) => {
  const { error } = profileSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }
  next()
}
