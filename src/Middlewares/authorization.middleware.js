import ErrorHandlerClass from "../Utils/error-class.utils.js";

const authorizationMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
        const user = req.authUser;
        if (!allowedRoles.includes(user.role)) {
            return next(
                new ErrorHandlerClass(
                    "Unauthorized access",
                    401,
                    "Error in authorization middleware",
                    "You are not allowed to access this route",
                    {
                        userData: {
                            name: user.userName,
                            email: user.email,
                            role: user.role,
                        },
                    }
                )
            );
        }
        next();
    };
};

export { authorizationMiddleware };
