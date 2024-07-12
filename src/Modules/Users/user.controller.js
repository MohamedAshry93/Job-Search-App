import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../../database/Models/user.model.js";
import ErrorHandlerClass from "../../Utils/error-class.utils.js";
import { sendEmailService } from "../../Services/send-email.service.js";
import Company from "../../../database/Models/company.model.js";
import Job from "../../../database/Models/job.model.js";
import App from "../../../database/Models/application.model.js";

//! ========================================== Registration ========================================== //
const signUp = async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        recoveryEmail,
        DOB,
        mobileNumber,
        role,
        status,
    } = req.body;
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);
    const hashedConfirmPassword = bcrypt.hashSync(
        confirmPassword,
        +process.env.SALT_ROUNDS
    );
    const userInstance = new User({
        firstName,
        lastName,
        userName: firstName + lastName,
        email,
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword,
        recoveryEmail,
        DOB,
        mobileNumber,
        role,
        status,
    });
    const token = jwt.sign(
        {
            userId: userInstance._id,
            email: userInstance.email,
            recoveryEmail: userInstance.recoveryEmail,
            mobile: userInstance.mobileNumber,
        },
        "confirmationLinkToken",
        { expiresIn: "1h" }
    );
    const confirmationLink = `${req.protocol}://${req.headers.host}/users/verify-email/${token}`;
    const isEmailSent = await sendEmailService(
        email,
        recoveryEmail,
        "Welcome to Our App - Verify your email address",
        "Please verify your email address",
        `<a href=${confirmationLink}>Please verify your email address</a>`
    );
    if (!isEmailSent) {
        return next(
            new ErrorHandlerClass(
                "Verification sending email is failed, please try again",
                400,
                "at checking isEmailSent",
                "Error in signUp controller",
                { email }
            )
        );
    }
    const user = await userInstance.save();
    res.status(201).json({
        message: "User created successfully",
        userData: {
            id: user._id,
            name: user.userName,
            email: user.email,
            recoveryEmail: user.recoveryEmail,
            mobile: user.mobileNumber,
            role: user.role,
            verified: user.verified,
        },
    });
};

//! ============================================= Verify email ============================================= //
const verifyEmail = async (req, res, next) => {
    const { token } = req.params;
    const decodedData = jwt.verify(token, "confirmationLinkToken");
    if (!decodedData?.userId) {
        return next(
            new ErrorHandlerClass(
                "Invalid token payload",
                401,
                "at verify decodedData",
                "Error in verifyEmail controller",
                { token }
            )
        );
    }
    const confirmedUser = await User.findOneAndUpdate(
        {
            _id: decodedData?.userId,
            verified: false,
        },
        { verified: true },
        { new: true }
    );
    if (!confirmedUser) {
        return next(
            new ErrorHandlerClass(
                "Invalid verification link",
                404,
                "at checking confirmedUser",
                "Error in verifyEmail controller",
                { token }
            )
        );
    }
    res
        .status(200)
        .json({ message: "Email verified successfully", confirmedUser });
};

//! ============================================= Login ============================================= //
const signIn = async (req, res, next) => {
    const { email, recoveryEmail, mobileNumber, password } = req.body;
    const user = await User.findOne({
        $or: [{ email }, { recoveryEmail }, { mobileNumber }],
    });
    if (!user) {
        return next(
            new ErrorHandlerClass(
                "Invalid Login credentials",
                404,
                "at checking user",
                "Error in signIn controller"
            )
        );
    }
    if (!bcrypt.compareSync(password, user.password)) {
        return next(
            new ErrorHandlerClass(
                "Invalid Login credentials",
                401,
                "at comparing password",
                "Error in signIn controller"
            )
        );
    }
    const token = jwt.sign(
        {
            userId: user._id,
            name: user.userName,
            email: user.email,
            recoveryEmail: user.recoveryEmail,
            mobile: user.mobileNumber,
        },
        "accessTokenSignature",
        { expiresIn: "1h" }
    );
    (user.status = "online"), await user.save();
    res.status(200).json({ message: "User logIn successfully", token });
};

//! ============================================= Log Out ============================================= //
const signOut = async (req, res, next) => {
    const { _id } = req.authUser;
    const user = await User.findOneAndUpdate(
        _id,
        { status: "offline" },
        { new: true }
    );
    res.status(200).json({
        message: "User logOut successfully",
        userData: { name: user.userName },
    });
};

//! ================================= Update account by his user ================================= //
const updatedAccount = async (req, res, next) => {
    const { firstName, lastName, email, recoveryEmail, DOB, mobileNumber } =
        req.body;
    const { _id } = req.authUser;
    const user = await User.findOneAndUpdate(
        _id,
        {
            firstName,
            lastName,
            email,
            recoveryEmail,
            DOB,
            mobileNumber,
            $inc: { version_key: 1 },
        },
        { new: true }
    );
    if (email) {
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                recoveryEmail: user.recoveryEmail,
                mobile: user.mobileNumber,
            },
            "confirmationLinkToken",
            { expiresIn: "1h" }
        );
        const confirmationLink = `${req.protocol}://${req.headers.host}/users/verify-email/${token}`;
        const isEmailSent = await sendEmailService(
            email,
            "Welcome to Our App - Verify your email address",
            "Please verify your email address",
            `<a href=${confirmationLink}>Please verify your email address</a>`
        );
        if (!isEmailSent) {
            return next(
                new ErrorHandlerClass(
                    "Verification sending email is failed, please try again",
                    400,
                    "at checking isEmailSent",
                    "Error in updatedAccount controller",
                    { email }
                )
            );
        }
    }
    res.status(200).json({
        message: "User updated successfully",
        userData: {
            id: user._id,
            name: user.name,
            verified: user.verified,
        },
    });
};

//! ==================================== Delete account by his user ==================================== //
const deletedAccount = async (req, res, next) => {
    const { _id } = req.authUser;
    const user = await User.findById(_id);
    if (user.role == "Company_HR") {
        await Company.findOneAndDelete({ companyHR: _id });
        await Job.findOneAndDelete({ addedBy: _id });
        await User.findByIdAndDelete(_id);
    }
    if (user.role == "User") {
        await App.deleteMany({ userId: _id });
    }
    res.status(200).json({
        message: "User deleted successfully",
        userData: {
            id: user._id,
            name: user.userName,
            email: user.email,
            recoveryEmail: user.recoveryEmail,
            mobile: user.mobileNumber,
            role: user.role,
            verified: user.verified,
        },
    });
};

//! ====================================== Get user account data ====================================== //
const getUserData = async (req, res, next) => {
    const { _id } = req.authUser;
    const user = await User.findById(_id);
    res.status(200).json({
        message: "User data",
        userData: {
            id: user._id,
            name: user.userName,
            email: user.email,
            birthDate: user.DOB,
            mobile: user.mobileNumber,
            role: user.role,
        },
    });
};

//! ================================== Get profile data for another user ================================= //
const getProfileData = async (req, res, next) => {
    const { _id } = req.params;
    const user = await User.findById(_id);
    if (!user) {
        return next(
            new ErrorHandlerClass(
                "User not found",
                404,
                "at searching for user",
                "Error in getProfileData controller",
                { _id }
            )
        );
    }
    res.status(200).json({
        message: "User data",
        userData: {
            id: user._id,
            name: user.userName,
            email: user.email,
            birthDate: user.DOB,
            mobile: user.mobileNumber,
            role: user.role,
        },
    });
};

//! ========================================= Update password ========================================= //
const updatedPassword = async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    const { _id } = req.authUser;
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);
    const hashedConfirmPassword = bcrypt.hashSync(
        confirmPassword,
        +process.env.SALT_ROUNDS
    );
    const user = await User.findOneAndUpdate(
        _id,
        {
            password: hashedPassword,
            confirmPassword: hashedConfirmPassword,
            $inc: { version_key: 1 },
        },
        { new: true }
    );
    res.status(200).json({
        message: "Password updated successfully",
        userData: {
            id: user._id,
            name: user.userName,
            email: user.email,
            verified: user.verified,
        },
    });
};

//! ========================================= Forget password ========================================= //
const forgetPassword = async (req, res, next) => {
    const { email, recoveryEmail } = req.body;
    const user = await User.findOne({ $or: [{ email }, { recoveryEmail }] });
    if (!user) {
        return next(
            new ErrorHandlerClass(
                "User not found",
                404,
                "at searching for user",
                "Error in forgetPassword controller",
                { email, recoveryEmail }
            )
        );
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 3600000;
    const isEmailSent = await sendEmailService(
        `${email} ${recoveryEmail}`,
        "Welcome to Our App - Password Reset OTP",
        "Password Reset OTP",
        `<b>Your OTP for password reset is:</b> ${otp}`
    );
    if (!isEmailSent) {
        return next(
            new ErrorHandlerClass(
                "Verification sending email is failed, please try again",
                400,
                "at checking isEmailSent",
                "Error in signUp controller",
                { email }
            )
        );
    }
    await user.save();
    res.status(200).json({ message: "OTP sent successfully", otp });
};

//! ========================================= Reset password ========================================= //
const resetPassword = async (req, res, next) => {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({
        email,
        resetPasswordOtp: otp,
        resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(
            new ErrorHandlerClass(
                "Invalid or expired OTP",
                404,
                "at searching for user",
                "Error in resetPassword controller",
                { email, otp }
            )
        );
    }
    const hashedNewPassword = bcrypt.hashSync(
        newPassword,
        +process.env.SALT_ROUNDS
    );
    user.password = hashedNewPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
};

//! ===================== Get all accounts associated to a specific recovery Email  ===================== //
const allAccount = async (req, res, next) => {
    const { recoveryEmail } = req.query;
    const users = await User.find(
        { recoveryEmail },
        { password: 0, confirmPassword: 0, createdAt: 0, updatedAt: 0 }
    );
    if (!users) {
        return next(
            new ErrorHandlerClass(
                "Users not found",
                404,
                "at searching for users",
                "Error in allAccount controller",
                { recoveryEmail }
            )
        );
    }
    res.status(200).json({ message: "All accounts", users });
};

export {
    signUp,
    verifyEmail,
    signIn,
    signOut,
    updatedAccount,
    deletedAccount,
    getUserData,
    getProfileData,
    updatedPassword,
    forgetPassword,
    resetPassword,
    allAccount,
};
