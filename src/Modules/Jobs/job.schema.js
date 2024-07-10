import Joi from "joi";
import { generalRules } from "../../Utils/general-rules.utils.js";

const addJobSchema = {
    body: Joi.object({
        jobTitle: generalRules.jobTitle,
        jobLocation: generalRules.jobLocation,
        workingTime: generalRules.workingTime,
        seniorityLevel: generalRules.seniorityLevel,
        jobDescription: generalRules.jobDescription,
        technicalSkills: generalRules.technicalSkills,
        softSkills: generalRules.softSkills,
    }),
};

const updatedJobSchema = {
    params: Joi.object({
        _id: generalRules.objectId,
    }),
};

const deleteJobSchema = {
    params: Joi.object({
        _id: generalRules.objectId,
    }),
};

const jobsCompanySchema = {
    query: Joi.object({
        companyName: generalRules.companyName,
    }),
};

const filteredJobsSchema = {
    query: Joi.object({
        jobTitle: generalRules.jobTitle.optional(),
        jobLocation: generalRules.jobLocation.optional(),
        workingTime: generalRules.workingTime.optional(),
        seniorityLevel: generalRules.seniorityLevel.optional(),
        technicalSkills: generalRules.technicalSkills.optional(),
    }),
};

const addApplicationSchema = {
    body: Joi.object({
        jobId: generalRules.objectId,
        userId: generalRules.objectId,
        userTechSkills: Joi.array().items(Joi.string()).required().messages({
            "any.required": "you need to enter the technical skills",
            "string.empty": "technicalSkills cannot be an empty string",
            "array.base": "technicalSkills must be an array",
            "array.empty": "technicalSkills cannot be an empty array",
        }),
        userSoftSkills: Joi.array().items(Joi.string()).required().messages({
            "any.required": "you need to enter the soft skills",
            "array.base": "softSkills must be an array",
            "array.empty": "softSkills cannot be an empty array",
            "string.empty": "softSkills cannot be an empty string",
        }),
        userResume: Joi.string().required().messages({
            "any.required": "you need to upload your resume",
            "string.empty": "resume cannot be an empty string",
        }),
    }),
};

export {
    addJobSchema,
    updatedJobSchema,
    deleteJobSchema,
    jobsCompanySchema,
    filteredJobsSchema,
    addApplicationSchema,
};
