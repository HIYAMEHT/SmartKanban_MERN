const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },

    column: {
      type: String,
      trim: true,
      default: "To Do",
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "To Do",
        "In Progress",
        "Review",
        "Completed",
      ],
      default: "To Do",
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
      ],
      default: "Medium",
    },

    estimatedHours: {
      type: Number,
      default: 0,
      min: 0,
    },

    skillsRequired: {
      type: [String],
      default: [],
    },

    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.pre("save", function () {
  if (this.isModified("status")) {
    if (this.status === "Completed") {
      this.completedAt = new Date();
    } else {
      this.completedAt = null;
    }
  }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;