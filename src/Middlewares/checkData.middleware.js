import User from "../../database/Models/user.model.js";
import ErrorHandlerClass from "../Utils/error-class.utils.js";

const checkDataExist = async (req, res, next) => {
    const { email, mobileNumber } = req.body;
    const user = await User.findOne({
        $or: [{ email }, { mobileNumber }],
    });
    if (user) {
        return next(
            new ErrorHandlerClass(
                "Data already exist!",
                409,
                "at checkDataExist API",
                "Error in checkData middleware",
                { email, mobileNumber }
            )
        );
    }
    next();
};

export { checkDataExist };
