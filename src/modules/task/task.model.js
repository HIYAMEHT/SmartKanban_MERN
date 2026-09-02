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

    // Project relationship
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },

    // Board relationship
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },

    // Kanban column
    column: {
      type: String,
      required: true,
      trim: true,
    },

    // Assigned user
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Task status
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Review", "Completed"],
      default: "To Do",
    },

    // Task priority
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    // Estimated time
    estimatedHours: {
      type: Number,
      default: 0,
      min: [0, "Estimated hours cannot be negative"],
    },

    // Skills required for the task
    skillsRequired: {
      type: [String],
      default: [],
    },

    // Task deadline
    deadline: {
      type: Date,
      default: null,
    },

    // Alternative due date
    dueDate: {
      type: Date,
      default: null,
    },

    // User who created the task
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Automatically populated when task is completed
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Set completedAt when task status changes
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