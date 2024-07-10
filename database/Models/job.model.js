import mongoose from "mongoose";

const { Schema, model } = mongoose;

const jobSchema = new Schema(
    {
        jobTitle: {
            type: String,
            required: true,
            trim: true,
            maxLength: 150,
        },
        jobLocation: {
            type: String,
            enum: ["onsite", "remotely", "hybrid"],
            required: true,
        },
        workingTime: {
            type: String,
            enum: ["part-time", "full-time"],
            required: true,
        },
        seniorityLevel: {
            type: String,
            enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
            required: true,
        },
        jobDescription: {
            type: String,
            required: true,
            trim: true,
            maxLength: 500,
        },
        technicalSkills: {
            type: [String],
            required: true,
        },
        softSkills: {
            type: [String],
            required: true,
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true, versionKey: "version_key" }
);

export default mongoose.models.Job || model("Job", jobSchema);
