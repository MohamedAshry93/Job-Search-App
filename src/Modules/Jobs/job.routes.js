import { Router } from "express";
import * as jobController from "./job.controller.js";
import { errorHandling } from "../../Middlewares/error-handle.middleware.js";
import { authMiddleware } from "../../Middlewares/auth.middleware.js";
import { authorizationMiddleware } from "../../Middlewares/authorization.middleware.js";
import validationMiddleware from "../../Middlewares/validation.middleware.js";
import roles from "./job.roles.js";
import {
    addApplicationSchema,
    addJobSchema,
    deleteJobSchema,
    filteredJobsSchema,
    jobsCompanySchema,
    updatedJobSchema,
} from "./job.schema.js";

const jobRouter = Router();

jobRouter.post(
    "/add-job",
    errorHandling(authMiddleware()),
    errorHandling(authorizationMiddleware(roles.JOB_ROLES_HR)),
    errorHandling(validationMiddleware(addJobSchema)),
    errorHandling(jobController.addJob)
);

jobRouter.put(
    "/update-job/:_id",
    errorHandling(authMiddleware()),
    errorHandling(authorizationMiddleware(roles.JOB_ROLES_HR)),
    errorHandling(validationMiddleware(updatedJobSchema)),
    errorHandling(jobController.updatedJob)
);

jobRouter.delete(
    "/delete-job/:_id",
    errorHandling(authMiddleware()),
    errorHandling(authorizationMiddleware(roles.JOB_ROLES_HR)),
    errorHandling(validationMiddleware(deleteJobSchema)),
    errorHandling(jobController.deleteJob)
);

jobRouter.get(
    "/list-jobs",
    errorHandling(authMiddleware()),
    errorHandling(authorizationMiddleware(roles.JOB_ROLES_HR_USER)),
    errorHandling(jobController.listJobs)
);

jobRouter.get(
    "/jobs-company",
    errorHandling(authMiddleware()),
    errorHandling(authorizationMiddleware(roles.JOB_ROLES_HR_USER)),
    errorHandling(validationMiddleware(jobsCompanySchema)),
    errorHandling(jobController.jobsCompany)
);

jobRouter.get(
    "/filter",
    errorHandling(authMiddleware()),
    errorHandling(authorizationMiddleware(roles.JOB_ROLES_HR_USER)),
    errorHandling(validationMiddleware(filteredJobsSchema)),
    errorHandling(jobController.filteredJobs)
);

jobRouter.post(
    "/application",
    errorHandling(authMiddleware()),
    errorHandling(authorizationMiddleware(roles.JOB_ROLES_USER)),
    errorHandling(validationMiddleware(addApplicationSchema)),
    errorHandling(jobController.addApplication)
);

export default jobRouter;
