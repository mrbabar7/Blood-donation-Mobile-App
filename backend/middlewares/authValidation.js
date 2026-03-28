const Joi = require("joi");

const validateSignup = (req, res, next) => {
  const signUpObject = Joi.object({
    name: Joi.string().min(5).max(20).required().messages({
      "string.empty": "Username is required",
      "string.min": "Name must have at least 5 characters.",
      "string.max": "Name must not exceed 20 characters.",
    }),

    email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
    }),
    password: Joi.string().min(4).max(12).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 4 characters long",
      "string.max": "Password must not exceed 12 characters",
    }),
  });

  const { error } = signUpObject.validate(req.body);
  if (error) {
    return res.status(404).json({
      field: error.details[0].path[0],
      message: error.details[0].message,
      success: false,
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const logInObject = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
    }),
    password: Joi.string().min(4).max(12).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 4 characters long",
      "string.max": "Password must not exceed 12 characters",
    }),
  });

  const { error } = logInObject.validate(req.body);
  if (error) {
    return res.status(404).json({
      field: error.details[0].path[0],
      message: error.details[0].message,
      success: false,
    });
  }
  next();
};

module.exports = { validateSignup, validateLogin };
