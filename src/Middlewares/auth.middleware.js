import User from "../../database/Models/user.model.js";
import jwt from "jsonwebtoken";
import ErrorHandlerClass from "../Utils/error-class.utils.js";

//implement authentication
const authMiddleware = () => {
    return async (req, res, next) => {
        //destruct token
        const { token } = req.headers;
        if (!token) {
            return next(
                new ErrorHandlerClass(
                    "Please login to access this resource",
                    401,
                    "at auth middleware",
                    "Error in auth middleware",
                    { token }
                )
            );
        }
        //check bearer token
        if (!token.startsWith("jobSearchApp")) {
            return next(
                new ErrorHandlerClass(
                    "Invalid token",
                    401,
                    "at auth middleware",
                    "Error in auth middleware",
                    { token }
                )
            );
        }
        // get token without bearer
        const originalToken = token.split(" ")[1];
        const decodedData = jwt.verify(originalToken, "accessTokenSignature");
        if (!decodedData?.userId) {
            return next(
                new ErrorHandlerClass(
                    "Invalid token payload",
                    401,
                    "at verify decodedData",
                    "Error in auth middleware",
                    { token }
                )
            );
        }
        const user = await User.findById(decodedData?.userId).select(
            "-password -confirmPassword"
        );
        if (!user) {
            return next(
                new ErrorHandlerClass(
                    "Please signUp and try to logIn again",
                    401,
                    "at findUserById",
                    "Error in auth middleware",
                    { userId: decodedData.userId }
                )
            );
        }
        req.authUser = user;
        next();
    };
};

export { authMiddleware };
