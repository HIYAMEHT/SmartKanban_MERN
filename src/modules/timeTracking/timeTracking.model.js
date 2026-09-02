const mongoose = require("mongoose");

<<<<<<< HEAD
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TimeLog", timeLogSchema);
=======
const timeLogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, //will take from user model
      ref: "User",
      required: [true, "User is required"],
    },
    task: {
      type: mongoose.Schema.Types.ObjectId, //will take from task model
      ref: "Task",
      required: [true, "Task is required"],
    },
    startTime: {
      type: Date,
      required: [true, "Start time cannot be null"],
    },
    endTime: {
      type: Date,
    },
    durationSeconds: {
      type: Number,
      default: 0,
      min : 0 
    },
    status: {
      type: String,
      enum: ["Running", "Adjusted", "Completed"],
      required : [true,"Status is required"]
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("TimeLog",timeLogSchema) ;
>>>>>>> origin/feature/time-tracking-analytics
