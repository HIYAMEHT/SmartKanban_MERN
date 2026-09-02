const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Null indicates unassigned task
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Review", "Completed"],
      default: "To Do",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    estimatedHours: {
      type: Number,
      default: 0,
      min: [0, "Estimated hours cannot be negative"],
    },
    
    skillsRequired: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
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

// Middleware to set completedAt when task is marked Completed
taskSchema.pre("save", function () {
  if (this.isModified("status")) {
    if (this.status === "Completed") {
      this.completedAt = new Date();
    } else {
      this.completedAt = null;
    }
  }
});


module.exports = mongoose.model("Task", taskSchema);
