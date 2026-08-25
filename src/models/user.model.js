import mongoose from "mongoose";
import { ROLES } from "../constants/roles.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.USER
        },

        skills: {
            type: [String],
            default: []
        },

        availability: {
            status: {
                type: String,
                enum: ["available", "unavailable"],
                default: "available"
            },

            hoursPerDay: {
                type: Number,
                min: 0,
                max: 24,
                default: 8
            }
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;