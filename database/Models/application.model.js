import mongoose from "mongoose";

const { Schema, model } = mongoose;

const applicationSchema = new Schema(
    {
        jobId: {
            type: Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userTechSkills: {
            type: [String],
            required: true,
        },
        userSoftSkills: {
            type: [String],
            required: true,
        },
        userResume: {
            type: String,
            required: true,
        },
    },
    { timestamps: true, versionKey: "version_key" }
);

export default mongoose.models.Application ||
    model("Application", applicationSchema);
