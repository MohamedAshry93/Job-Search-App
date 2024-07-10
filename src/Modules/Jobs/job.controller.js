import App from "../../../database/Models/application.model.js";
import Company from "../../../database/Models/company.model.js";
import Job from "../../../database/Models/job.model.js";
import ErrorHandlerClass from "../../Utils/error-class.utils.js";

//! ========================================== Add job ========================================== //
const addJob = async (req, res, next) => {
    const { _id: addedBy } = req.authUser;
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
    } = req.body;
    const jobInstance = new Job({
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy,
    });
    const job = await jobInstance.save();
    res.status(201).json({ message: "Job added successfully", job });
};

//! ========================================== Update job ========================================== //
const updatedJob = async (req, res, next) => {
    const { _id } = req.params;
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
    } = req.body;
    const job = await Job.findByIdAndUpdate(
        { _id },
        {
            jobTitle,
            jobLocation,
            workingTime,
            seniorityLevel,
            jobDescription,
            technicalSkills,
            softSkills,
        },
        { new: true }
    );
    if (!job) {
        return next(new ErrorHandlerClass("Job not found", 404));
    }
    res.status(200).json({ message: "Job updated successfully", job });
};

//! ========================================== Delete job ========================================== //
const deleteJob = async (req, res, next) => {
    const { _id } = req.params;
    const job = await Job.findByIdAndDelete({ _id });
    if (!job) {
        return next(new ErrorHandlerClass("Job not found", 404));
    }
    res.status(200).json({ message: "Job deleted successfully", job });
};

//! ========================== Get all Jobs with their company’s information =========================== //
const listJobs = async (req, res, next) => {
    const jobs = await Job.find().populate([
        { path: "addedBy", select: "userName" },
    ]);
    if (jobs.length == 0) {
        return next(
            new ErrorHandlerClass(
                "Jobs not found",
                404,
                "at searching for jobs",
                "Error in listJobs controller"
            )
        );
    }
    const jobIds = jobs.map((job) => job.addedBy);
    console.log(jobIds);
    const company = await Company.find({ companyHR: { $in: jobIds } });
    if (company.length == 0) {
        return next(
            new ErrorHandlerClass(
                "Company not found",
                404,
                "at searching for company",
                "Error in listJobs controller"
            )
        );
    }
    res.status(200).json({ message: "Jobs found successfully", jobs, company });
};

//! =============================== Get all Jobs for a specific company ================================ //
const jobsCompany = async (req, res, next) => {
    const { companyName } = req.query;
    const company = await Company.findOne({ companyName });
    if (!company) {
        return next(
            new ErrorHandlerClass(
                "Company not found",
                404,
                "at searching for company",
                "Error in jobsCompany controller"
            )
        );
    }
    const jobs = await Job.find({ addedBy: company.companyHR });
    if (jobs.length == 0) {
        return next(
            new ErrorHandlerClass(
                "Jobs not found",
                404,
                "at searching for jobs",
                "Error in jobsCompany controller"
            )
        );
    }
    res.status(200).json({ message: "Jobs found successfully", jobs });
};

//! ========================== Get all Jobs that match the required filters =========================== //
const filteredJobs = async (req, res, next) => {
    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        technicalSkills,
    } = req.query;
    const filter = {};
    if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: "i" };
    if (jobLocation) filter.jobLocation = jobLocation;
    if (workingTime) filter.workingTime = workingTime;
    if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
    if (technicalSkills)
        filter.technicalSkills = { $in: technicalSkills.split(",") };
    const jobs = await Job.find(filter).populate("addedBy", "companyName");
    res.status(200).json({ message: "Jobs found successfully", jobs });
};

//! ========================================== Apply to Job ========================================== //
const addApplication = async (req, res, next) => {
    const { jobId, userId, userTechSkills, userSoftSkills, userResume } =
        req.body;
    const applicationInstance = new App({
        jobId,
        userId,
        userTechSkills,
        userSoftSkills,
        userResume,
    });
    const application = await applicationInstance.save();
    res
        .status(201)
        .json({ message: "Application added successfully", application });
};

export {
    addJob,
    updatedJob,
    deleteJob,
    listJobs,
    jobsCompany,
    filteredJobs,
    addApplication,
};
