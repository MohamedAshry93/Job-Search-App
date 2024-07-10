import { Router } from "express";
import * as companyController from "./company.controller.js";
import { errorHandling } from "../../Middlewares/error-handle.middleware.js";
import { authMiddleware } from "../../Middlewares/auth.middleware.js";
import { authorizationMiddleware } from "../../Middlewares/authorization.middleware.js";
import roles from "./company.roles.js";
import validationMiddleware from "../../Middlewares/validation.middleware.js";
import {
    addCompanySchema,
    deletedCompanySchema,
    getCompanyDataSchema,
    getCompanySchema,
    updatedCompanySchema,
} from "./company.schema.js";

const companyRouter = Router();

companyRouter.post(
    "/add-company",
    errorHandling(authMiddleware()),
    errorHandling(authorizationMiddleware(roles.COMPANY_ROLES_HR)),
    validationMiddleware(addCompanySchema),
    errorHandling(companyController.addCompany)
);

companyRouter.put(
    "/update-company/:_id",
    errorHandling(authMiddleware()),
    errorHandling(authorizationMiddleware(roles.COMPANY_ROLES_HR)),
    validationMiddleware(updatedCompanySchema),
    errorHandling(companyController.updatedCompany)
);

companyRouter.delete(
    "/delete-company/:_id",
    errorHandling(authMiddleware()),
    errorHandling(authorizationMiddleware(roles.COMPANY_ROLES_HR)),
    validationMiddleware(deletedCompanySchema),
    errorHandling(companyController.deletedCompany)
);

companyRouter.get(
    "/company-data/:_id",
    errorHandling(authMiddleware()),
    errorHandling(authorizationMiddleware(roles.COMPANY_ROLES_HR)),
    validationMiddleware(getCompanyDataSchema),
    errorHandling(companyController.getCompanyData)
);

companyRouter.get(
    "/get-company",
    errorHandling(authMiddleware()),
    errorHandling(authorizationMiddleware(roles.COMPANY_ROLES_HR_USER)),
    validationMiddleware(getCompanySchema),
    errorHandling(companyController.getCompany)
);

companyRouter.get(
    "/applications",
    errorHandling(authMiddleware()),
    errorHandling(authorizationMiddleware(roles.COMPANY_ROLES_HR)),
    errorHandling(companyController.getApplications)
);

export default companyRouter;
