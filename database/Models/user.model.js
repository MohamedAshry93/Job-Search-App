import mongoose from "mongoose";
import { systemRoles } from "../../src/Utils/system-roles.utils.js";

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minLength: 3,
            maxLength: 20,
            lowercase: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minLength: 3,
            maxLength: 20,
            lowercase: true,
        },
        userName: {
            type: String,
            trim: true,
            minLength: 3,
            maxLength: 20,
            lowercase: true,
            indexedDB: false,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        confirmPassword: {
            type: String,
            required: true,
        },
        recoveryEmail: String,
        DOB: {
            type: Date,
            required: true,
        },
        mobileNumber: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: Object.values(systemRoles),
            default: systemRoles.USER,
        },
        status: {
            type: String,
            enum: ["online", "offline"],
            default: "offline",
        },
        verified: {
            type: Boolean,
            default: false,
        },
        resetPasswordOtp: String,
        resetPasswordExpires: Date,
    },
    { timestamps: true, versionKey: "version_key" }
);

export default mongoose.models.User || model("User", userSchema);
