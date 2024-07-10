import { Router } from "express";
import * as userController from "./user.controller.js";
import { errorHandling } from "../../Middlewares/error-handle.middleware.js";
import { checkDataExist } from "../../Middlewares/checkData.middleware.js";
import { authMiddleware } from "../../Middlewares/auth.middleware.js";
import validationMiddleware from "../../Middlewares/validation.middleware.js";
import {
    allAccountSchema,
    forgetPasswordSchema,
    getProfileDataSchema,
    resetPasswordSchema,
    signInSchema,
    signUpSchema,
    updatedAccountSchema,
    updatedPasswordSchema,
} from "./user.schema.js";

const userRouter = Router();

userRouter.post(
    "/signup",
    errorHandling(validationMiddleware(signUpSchema)),
    errorHandling(checkDataExist),
    errorHandling(userController.signUp)
);

userRouter.post(
    "/login",
    errorHandling(validationMiddleware(signInSchema)),
    errorHandling(userController.signIn)
);

userRouter.post(
    "/logout",
    errorHandling(authMiddleware()),
    errorHandling(userController.signOut)
);

userRouter.put(
    "/update",
    errorHandling(authMiddleware()),
    errorHandling(validationMiddleware(updatedAccountSchema)),
    errorHandling(checkDataExist),
    errorHandling(userController.updatedAccount)
);

userRouter.get(
    "/verify-email/:token",
    errorHandling(userController.verifyEmail)
);

userRouter.post(
    "/forget-password",
    errorHandling(validationMiddleware(forgetPasswordSchema)),
    errorHandling(userController.forgetPassword)
);

userRouter.post(
    "/reset-password",
    errorHandling(validationMiddleware(resetPasswordSchema)),
    errorHandling(userController.resetPassword)
);

userRouter.delete(
    "/delete",
    errorHandling(authMiddleware()),
    errorHandling(userController.deletedAccount)
);

userRouter.get(
    "/user-data",
    errorHandling(authMiddleware()),
    errorHandling(userController.getUserData)
);

userRouter.get(
    "/profile-data/:_id",
    errorHandling(validationMiddleware(getProfileDataSchema)),
    errorHandling(userController.getProfileData)
);

userRouter.put(
    "/update-password",
    errorHandling(authMiddleware()),
    errorHandling(validationMiddleware(updatedPasswordSchema)),
    errorHandling(userController.updatedPassword)
);

userRouter.get(
    "/list-account",
    errorHandling(authMiddleware()),
    errorHandling(validationMiddleware(allAccountSchema)),
    errorHandling(userController.allAccount)
);

export default userRouter;
