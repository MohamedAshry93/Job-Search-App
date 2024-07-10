import Joi from "joi";
import { generalRules } from "../../Utils/general-rules.utils.js";

const addCompanySchema = {
    body: Joi.object({
        companyName: generalRules.companyName,
        description: generalRules.description,
        industry: generalRules.industry,
        address: generalRules.address,
        numberOfEmployees: generalRules.numberOfEmployees,
        companyEmail: generalRules.companyEmail,
        companyHR: generalRules.objectId,
    }),
};

const updatedCompanySchema = {
    body: Joi.object({
        companyName: generalRules.companyName.optional(),
        description: generalRules.description.optional(),
        industry: generalRules.industry.optional(),
        address: generalRules.address.optional(),
        numberOfEmployees: generalRules.numberOfEmployees.optional(),
        companyEmail: generalRules.companyEmail.optional(),
    }),
    params: Joi.object({
        _id: generalRules.objectId,
    }),
};

const deletedCompanySchema = {
    params: Joi.object({
        _id: generalRules.objectId,
    }),
};

const getCompanyDataSchema = {
    params: Joi.object({
        _id: generalRules.objectId,
    }),
};

const getCompanySchema = {
    query: Joi.object({
        companyName: generalRules.companyName,
    }),
};

export {
    addCompanySchema,
    updatedCompanySchema,
    deletedCompanySchema,
    getCompanyDataSchema,
    getCompanySchema,
};
