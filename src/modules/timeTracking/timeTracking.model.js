const mongoose = require("mongoose");

const timeLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: [true, "Task is required"],
    },

    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },

    endTime: {
      type: Date,
      default: null,
    },

    durationSeconds: {
      type: Number,
      default: 0,
      min: [0, "Duration cannot be negative"],
    },

    status: {
      type: String,
      enum: [
        "Running",
        "Adjusted",
        "Completed",
      ],
      default: "Running",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model("TimeLog", timeLogSchema);