import Joi from "joi";

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).optional().messages({
    "string.min": "First name must be at least 1 character long",
    "string.max": "First name must not exceed 50 characters",
  }),
  lastName: Joi.string().min(1).max(50).optional().messages({
    "string.min": "Last name must be at least 1 character long",
    "string.max": "Last name must not exceed 50 characters",
  }),
  bio: Joi.string().max(500).optional().allow("").messages({
    "string.max": "Bio must not exceed 500 characters",
  }),
  avatarUrl: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Avatar URL must be a valid URL",
  }),
  preferences: Joi.object().optional().messages({
    "object.base": "Preferences must be a valid object",
  }),
});

export const createProfileSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).optional().messages({
    "string.min": "First name must be at least 1 character long",
    "string.max": "First name must not exceed 50 characters",
  }),
  lastName: Joi.string().min(1).max(50).optional().messages({
    "string.min": "Last name must be at least 1 character long",
    "string.max": "Last name must not exceed 50 characters",
  }),
  bio: Joi.string().max(500).optional().allow("").messages({
    "string.max": "Bio must not exceed 500 characters",
  }),
  avatarUrl: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Avatar URL must be a valid URL",
  }),
  preferences: Joi.object().optional().default({}).messages({
    "object.base": "Preferences must be a valid object",
  }),
});
