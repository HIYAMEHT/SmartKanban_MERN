const mongoose = require("mongoose");

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
