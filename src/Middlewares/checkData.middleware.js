import Company from "../../database/Models/company.model.js";
import User from "../../database/Models/user.model.js";
import ErrorHandlerClass from "../Utils/error-class.utils.js";

const checkDataExist = async (req, res, next) => {
    const { email, mobileNumber, firstName, lastName } = req.body;
    const userName = firstName + lastName;
    const user = await User.findOne({
        $or: [{ email }, { mobileNumber }, { userName }],
    });
    if (user) {
        const object = {};
        if (user.email == email) {
            object["email"] = user.email;
        }
        if (user.mobileNumber == mobileNumber) {
            object["mobileNumber"] = user.mobileNumber;
        }
        if (user.userName == userName.toLowerCase()) {
            object["lastName"] = user.lastName;
            object["firstName"] = user.firstName;
        }
        return next(
            new ErrorHandlerClass(
                "Data already exist!",
                409,
                "at checkDataExist API",
                "Error in checkData middleware",
                object
            )
        );
    }
    next();
};

const checkCompanyExist = async (req, res, next) => {
    const { companyName, companyEmail } = req.body;
    const company = await Company.findOne({
        $or: [{ companyName }, { companyEmail }],
    });
    if (company) {
        return next(
            new ErrorHandlerClass(
                "Company already exist!",
                409,
                "at checkCompanyExist API",
                "Error in checkCompanyExist middleware",
                { companyName, companyEmail }
            )
        );
    }
    next();
};

export { checkDataExist, checkCompanyExist };
