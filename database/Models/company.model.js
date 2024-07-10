import mongoose from "mongoose";

const { Schema, model } = mongoose;

const companySchema = new Schema(
    {
        companyName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        industry: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        numberOfEmployees: {
            type: Number,
            required: true,
            min: 11,
        },
        companyEmail: {
            type: String,
            required: true,
            unique: true,
        },
        companyHR: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true, versionKey: "version_key" }
);

export default mongoose.models.Company || model("Company", companySchema);
