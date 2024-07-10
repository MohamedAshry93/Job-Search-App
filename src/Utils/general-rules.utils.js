import Joi from "joi";
import { Types } from "mongoose";

const objectIdRule = (value, helper) => {
    const isObjectIdValid = Types.ObjectId.isValid(value);
    return isObjectIdValid
        ? value
        : helper.message("Invalid objectId length must be 24 and hexadecimal");
};

const generalRules = {
    objectId: Joi.string().custom(objectIdRule).required().messages({
        "any.required": "objectId is required",
        "string.base": "objectId must be a string",
        "string.empty": "objectId cannot be an empty string",
        "string.length": "objectId length must be 24 and hexadecimal",
    }),
    headers: Joi.object({
        "content-type": Joi.string().valid("application/json").optional(),
        "user-agent": Joi.string().optional(),
        host: Joi.string().optional(),
        "content-length": Joi.string().optional(),
        "accept-encoding": Joi.string().optional(),
        accept: Joi.string().optional(),
        "accept-language": Joi.string().optional(),
        "cache-control": Joi.string().optional(),
        connection: Joi.string().optional(),
        cookie: Joi.string().optional(),
        dnt: Joi.string().optional(),
        "postman-token": Joi.string().optional(),
        "user-agent": Joi.string().optional(),
        "x-forwarded-for": Joi.string().optional(),
        "x-forwarded-host": Joi.string().optional(),
        "x-forwarded-proto": Joi.string().optional(),
        "x-real-ip": Joi.string().optional(),
        "x-request-id": Joi.string().optional(),
        "x-ua-compatible": Joi.string().optional(),
        "x-verified-by": Joi.string().optional(),
        "x-verified-by": Joi.string().optional(),
        "x-verified-by": Joi.string().optional(),
    }),
    firstName: Joi.string().required().min(3).max(20).alphanum().messages({
        "any.required": "you need to enter your firstName",
        "string.min": "firstName must be at least 3 characters long",
        "string.max": "firstName must be at most 20 characters long",
        "string.base": "firstName must be a string",
        "string.empty": "firstName cannot be an empty string",
    }),
    lastName: Joi.string().required().min(3).max(20).alphanum().messages({
        "any.required": "you need to enter your lastName",
        "string.min": "lastName must be at least 3 characters long",
        "string.max": "lastName must be at most 20 characters long",
        "string.base": "lastName must be a string",
        "string.empty": "lastName cannot be an empty string",
    }),
    email: Joi.string()
        .email({
            tlds: { allow: ["com", "net"] },
            minDomainSegments: 2,
            maxDomainSegments: 3,
        })
        .required()
        .messages({
            "any.required": "you need to enter your email",
            "string.email":
                "email must be like example@gmail.com or example@mail.net",
            "string.empty": "email cannot be an empty string",
            "string.unique": "email must be unique",
        }),
    recoveryEmail: Joi.string()
        .email({
            tlds: { allow: ["com", "net"] },
            minDomainSegments: 2,
            maxDomainSegments: 3,
        })
        .optional()
        .messages({
            "string.email":
                "email must be like example@gmail.com or example@mail.net",
        }),
    password: Joi.string()
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
    DOB: Joi.date().required().messages({
        "any.required": "you need to enter your dateOfBirth",
        "date.base": "you need to enter a valid date",
        "date.format": "you need to enter a valid date in the format YYYY-MM-DD",
        "date.empty": "dateOfBirth cannot be an empty",
    }),
    mobileNumber: Joi.string()
        .required()
        .pattern(/^01[0125][0-9]{8}$/)
        .messages({
            "any.required": "you need to enter your phoneNumber",
            "string.pattern.base": "Please enter a valid egyptian number",
            "number.empty": "phoneNumber cannot be an empty number",
        }),
    companyName: Joi.string().required().messages({
        "any.required": "you need to enter the companyName",
        "string.base": "companyName must be a string",
        "string.unique": "companyName must be unique",
        "string.empty": "companyName must not be empty",
    }),
    companyEmail: Joi.string()
        .email({
            tlds: { allow: ["org", "net", "com"] },
            minDomainSegments: 2,
            maxDomainSegments: 3,
        })
        .required()
        .messages({
            "any.required": "you need to enter the companyEmail",
            "string.email":
                "email must be like example@gmail.com or example@mail.net example@mail.org",
            "string.empty": "email cannot be an empty string",
            "string.unique": "email must be unique",
        }),
    description: Joi.string().required().messages({
        "any.required": "you need to enter the description of your company",
        "string.empty": "description cannot be an empty string",
    }),
    industry: Joi.string().required().messages({
        "any.required": "you need to enter the field of your company",
        "string.empty": "industry cannot be an empty string",
    }),
    address: Joi.string().required().messages({
        "any.required": "you need to enter the address of your company",
        "string.empty": "address cannot be an empty string",
    }),
    numberOfEmployees: Joi.number().min(11).required().messages({
        "any.required": "you need to enter the No. of employees of your company",
        "number.min": "numberOfEmployees must be at least 11",
        "number.base": "numberOfEmployees must be a number",
        "number.empty": "numberOfEmployees cannot be an empty number",
    }),
    jobTitle: Joi.string().max(150).required().messages({
        "any.required": "you need to enter the job title",
        "string.max": "jobTitle must be less than 150 characters",
        "string.empty": "jobTitle cannot be an empty string",
    }),
    jobLocation: Joi.string()
        .required()
        .valid("onsite", "remotely", "hybrid")
        .messages({
            "any.required": "you need to enter the job location",
            "string.empty": "jobLocation cannot be an empty string",
            "any.only":
                "jobLocation must be either 'onsite', 'remotely', or 'hybrid'",
        }),
    workingTime: Joi.string()
        .required()
        .valid("part-time", "full-time")
        .messages({
            "any.required": "you need to enter the working time",
            "any.only": "workingTime must be either 'part-time' or 'full-time'",
            "string.empty": "workingTime cannot be an empty string",
        }),
    seniorityLevel: Joi.string()
        .required()
        .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
        .messages({
            "any.required": "you need to enter the seniority level",
            "any.only":
                "seniorityLevel must be either 'Junior', 'Mid-Level', 'Senior', 'Team-Lead', or 'CTO'",
            "string.empty": "seniorityLevel cannot be an empty string",
        }),
    jobDescription: Joi.string().max(500).required().messages({
        "any.required": "you need to enter the job description",
        "string.max": "jobDescription must be less than 500 characters",
        "string.empty": "jobDescription cannot be an empty string",
    }),
    technicalSkills: Joi.array().items(Joi.string()).required().messages({
        "any.required": "you need to enter the technical skills",
        "string.empty": "technicalSkills cannot be an empty string",
        "array.base": "technicalSkills must be an array",
        "array.empty": "technicalSkills cannot be an empty array",
    }),
    softSkills: Joi.array().items(Joi.string()).required().messages({
        "any.required": "you need to enter the soft skills",
        "array.base": "softSkills must be an array",
        "array.empty": "softSkills cannot be an empty array",
        "string.empty": "softSkills cannot be an empty string",
    }),
};

export { generalRules };
