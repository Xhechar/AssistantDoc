import Joi from "joi";

//program
export const createProgramSchema = Joi.object({
  ProgramName: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Program name is required.',
      'string.min': 'Program name must be at least 3 characters.',
      'string.max': 'Program name must not exceed 100 characters.',
      'any.required': 'Program name is required.'
    }),
  Description: Joi.string()
    .allow(null, '')
    .optional()
    .messages({
      'string.base': 'Description must be text.'
    })
});

export const updateProgramSchema = Joi.object({
  ProgramName: Joi.string()
    .min(3)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Program name must be at least 3 characters.',
      'string.max': 'Program name must not exceed 100 characters.'
    }),
  Description: Joi.string()
    .allow(null, '')
    .optional()
    .messages({
      'string.base': 'Description must be text.'
    })
});

//patient
export const registerPatientSchema = Joi.object({
  FullName: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Full name is required.',
      'string.min': 'Full name must be at least 3 characters.',
      'string.max': 'Full name must not exceed 100 characters.',
      'any.required': 'Full name is required.'
    }),
  Phone: Joi.string()
    .allow(null, '')
    .optional()
    .messages({
      'string.base': 'Phone must be text.'
    }),
  Email: Joi.string()
    .email()
    .allow(null, '')
    .optional()
    .messages({
      'string.email': 'Email must be a valid email address.'
    }),
  NationalId: Joi.string()
    .optional()
    .allow(null, '')
    .messages({
      'string.base': 'National ID must be text.'
    }),
  DateOfBirth: Joi.date()
    .optional()
    .allow(null, '')
    .messages({
      'date.base': 'Date of birth must be a valid date.'
    })
});

export const updatePatientSchema = Joi.object({
  FullName: Joi.string()
    .min(3)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Full name must be at least 3 characters.',
      'string.max': 'Full name must not exceed 100 characters.'
    }),
  Phone: Joi.string()
    .allow(null, '')
    .optional()
    .messages({
      'string.base': 'Phone must be text.'
    }),
  Email: Joi.string()
    .email()
    .allow(null, '')
    .optional()
    .messages({
      'string.email': 'Email must be a valid email address.'
    }),
    NationalId: Joi.string()
      .optional()
      .allow(null, '')
      .messages({
        'string.base': 'National ID must be text.'
      }),
    DateOfBirth: Joi.date()
      .optional()
      .allow(null, '')
      .messages({
        'date.base': 'Date of birth must be a valid date.'
      })
});

//enrollment
export const enrollPatientSchema = Joi.object({
  PatientId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Patient ID is required.',
      'any.required': 'Patient ID must be provided.'
    }),
  ProgramId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Program ID is required.',
      'any.required': 'Program ID must be provided.'
    })
});

export const updateEnrollmentSchema = Joi.object({
  PatientId: Joi.string()
    .optional()
    .messages({
      'string.base': 'Patient ID must be a string.'
    }),
  ProgramId: Joi.string()
    .optional()
    .messages({
      'string.base': 'Program ID must be a string.'
    })
});

// user
export const registerUserSchema = Joi.object({
  FullName: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Full name is required.',
      'string.min': 'Full name must be at least 3 characters.',
      'string.max': 'Full name must not exceed 100 characters.',
      'any.required': 'Full name is required.'
    }),
  Email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address.',
      'string.empty': 'Email is required.',
      'any.required': 'Email is required.'
    }),
  Phone: Joi.string()
    .required()
    .messages({
      'string.empty': 'Phone number is required.',
      'any.required': 'Phone number is required.'
    }),
  Password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters.',
      'string.empty': 'Password is required.',
      'any.required': 'Password is required.'
    })
});

export const loginUserSchema = Joi.object({
  Email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email.',
      'any.required': 'Email is required.'
    }),
  Password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required.',
      'any.required': 'Password is required.'
    })
});

export const updateUserSchema = Joi.object({
  FullName: Joi.string()
    .min(3)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Full name must be at least 3 characters.',
      'string.max': 'Full name must not exceed 100 characters.'
    }),
  Phone: Joi.string()
    .optional()
    .messages({
      'string.base': 'Phone number must be a string.'
    }),
  Email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Please enter a valid email address.'
    }),
  Password: Joi.string()
    .min(6)
    .optional()
    .messages({
      'string.min': 'Password must be at least 6 characters.'
    })
});

