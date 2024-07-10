import User from "../../database/Models/user.model.js";
import ErrorHandlerClass from "../Utils/error-class.utils.js";

const checkDataExist = async (req, res, next) => {
    const { email, mobileNumber, userName } = req.body;
    const user = await User.findOne({
        $or: [{ email }, { mobileNumber }, { userName }],
    });
    if (user) {
        next(
            new ErrorHandlerClass(
                "Data already exist",
                409,
                "at checkDataExist API",
                "Error in checkData middleware",
                { email, mobileNumber, userName }
            )
        );
    }
    next();
};

export { checkDataExist };
