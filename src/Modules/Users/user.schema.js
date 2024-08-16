import Joi from "joi";
import { generalRules } from "../../Utils/general-rules.utils.js";
import { systemRoles } from "../../Utils/system-roles.utils.js";

const signUpSchema = {
    body: Joi.object({
        firstName: generalRules.firstName,
        lastName: generalRules.lastName,
        email: generalRules.email,
        password: generalRules.password,
        confirmPassword: Joi.string()
            .valid(Joi.ref("password"))
            .required()
            .messages({
                "any.only": "passwords don't match",
                "any.required": "confirmPassword is required",
                "string.empty": "confirmPassword cannot be an empty string",
                "string.base": "confirmPassword must be a string",
            }),
        recoveryEmail: generalRules.recoveryEmail,
        DOB: generalRules.DOB,
        mobileNumber: generalRules.mobileNumber,
    }),
};
signUpSchema.body = signUpSchema.body.append({
    role: Joi.string()
        .optional()
        .valid(systemRoles.USER, systemRoles.COMPANY_HR)
        .messages({
            "string.base": "role must be a string",
            "any.only": "role must be one of the following: User, Company_HR",
            "string.empty": "role cannot be an empty string",
        }),
    status: Joi.string().optional().valid("online", "offline"),
});

const signInSchema = {
    body: Joi.object({
        email: generalRules.email,
        password: generalRules.password,
    }),
};

const updatedAccountSchema = {
    body: Joi.object({
        firstName: generalRules.firstName.optional(),
        lastName: generalRules.lastName.optional(),
        email: generalRules.email.optional(),
        recoveryEmail: generalRules.recoveryEmail.optional(),
        DOB: generalRules.DOB.optional(),
        mobileNumber: generalRules.mobileNumber.optional(),
    }),
};

const getProfileDataSchema = {
    params: Joi.object({
        _id: generalRules.objectId,
    }),
};

const updatedPasswordSchema = {
    body: Joi.object({
        password: generalRules.password,
        confirmPassword: Joi.string()
            .valid(Joi.ref("password"))
            .required()
            .messages({
                "any.only": "passwords don't match",
                "any.required": "confirmPassword is required",
                "string.empty": "confirmPassword cannot be an empty string",
                "string.base": "confirmPassword must be a string",
            }),
    }),
};

const forgetPasswordSchema = {
    body: Joi.object({
        email: generalRules.email.optional(),
        recoveryEmail: generalRules.recoveryEmail,
    }),
};

const resetPasswordSchema = {
    body: Joi.object({
        email: generalRules.email,
        newPassword: Joi.string()
            .required()
            .pattern(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            )
            .messages({
                "any.required": "you need to enter your password",
                "string.pattern.base":
                    "password must contain at least one lowercase letter ,at least one uppercase letter ,at least one digit ,at least one special character from the set @$!%*?& and minimum length 8",
                "string.empty": "password cannot be an empty string",
            }),
        otp: Joi.string().required().messages({
            "any.required": "you need to enter your otp",
            "string.empty": "otp cannot be an empty string",
        }),
    }),
};

const allAccountSchema = {
    query: Joi.object({
        recoveryEmail: generalRules.recoveryEmail,
    }),
};

export {
    signUpSchema,
    signInSchema,
    updatedAccountSchema,
    getProfileDataSchema,
    updatedPasswordSchema,
    forgetPasswordSchema,
    resetPasswordSchema,
    allAccountSchema,
};
