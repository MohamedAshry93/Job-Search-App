import Application from "../../../database/Models/application.model.js";
import Company from "../../../database/Models/company.model.js";
import Job from "../../../database/Models/job.model.js";
import ErrorHandlerClass from "../../Utils/error-class.utils.js";

//! ========================================== Add company ========================================== //
const addCompany = async (req, res, next) => {
    const { _id: companyHR } = req.authUser;
    const {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
    } = req.body;
    const companyInstance = new Company({
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        companyHR,
    });
    const company = await companyInstance.save();
    res.status(201).json({ message: "Company added successfully", company });
};

//! ====================================== Update company data ====================================== //
const updatedCompany = async (req, res, next) => {
    const { _id } = req.params;
    const {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
    } = req.body;
    const company = await Company.findOneAndUpdate(
        { _id },
        {
            companyName,
            description,
            industry,
            address,
            numberOfEmployees,
            companyEmail,
            $inc: { version_key: 1 },
        },
        { new: true }
    );
    if (!company) {
        return next(
            new ErrorHandlerClass(
                "Company not found",
                404,
                "at searching for company",
                "Error in update company controller",
                { company }
            )
        );
    }
    res.status(200).json({ message: "Company updated successfully", company });
};

//! ====================================== Delete company data ====================================== //
const deletedCompany = async (req, res, next) => {
    const { _id } = req.params;
    const company = await Company.findOneAndDelete({ _id });
    if (!company) {
        return next(
            new ErrorHandlerClass(
                "Company not found",
                404,
                "at searching for company",
                "Error in delete company controller",
                { company }
            )
        );
    }
    res.status(200).json({ message: "Company deleted successfully", company });
};

//! ====================================== Get company data ====================================== //
const getCompanyData = async (req, res, next) => {
    const { _id } = req.params;
    const company = await Company.findOne({ _id });
    if (!company) {
        return next(
            new ErrorHandlerClass(
                "Company not found",
                404,
                "at searching for company",
                "Error in get company data controller",
                { company }
            )
        );
    }
    const jobs = await Job.find({ addedBy: company.companyHR });
    res
        .status(200)
        .json({ message: "Company found successfully", company, jobs });
};

//! =============================== Search for a company with a name =============================== //
const getCompany = async (req, res, next) => {
    const { companyName } = req.query;
    const company = await Company.findOne({ companyName });
    if (!company) {
        return next(
            new ErrorHandlerClass(
                "Company not found",
                404,
                "at searching company",
                "Error in get company controller",
                { companyName }
            )
        );
    }
    res.status(200).json({ message: "Company found successfully", company });
};

//! =============================== Get all applications for specific Jobs =============================== //
const getApplications = async (req, res, next) => {
    const { _id } = req.authUser;
    const company = await Company.find({ companyHR: _id });
    if (company.length == 0) {
        return next(
            new ErrorHandlerClass(
                "Company not found",
                404,
                "at searching for company",
                "Error in get applications controller",
                { _id }
            )
        );
    }
    const jobs = await Job.find({ addedBy: _id });
    if (jobs.length == 0) {
        return next(
            new ErrorHandlerClass(
                "Jobs not found",
                404,
                "at searching for jobs",
                "Error in get applications controller",
                { _id }
            )
        );
    }
    const jobIds = jobs.map((job) => job._id);
    const applications = await Application.find({ jobId: { $in: jobIds } })
        .populate([{ path: "userId", select: "-password -confirmPassword" }])
        .populate("jobId");
    res
        .status(200)
        .json({ message: "Applications found successfully", applications });
};

export {
    addCompany,
    updatedCompany,
    deletedCompany,
    getCompanyData,
    getCompany,
    getApplications,
};
