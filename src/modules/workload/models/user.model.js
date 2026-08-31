const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    capacityHours: {
      type: Number,
      default: 40,
      min: [0, "Capacity cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
