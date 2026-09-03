const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: true },
);

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    columns: {
      type: [columnSchema],
      default: [
        { name: "To Do", order: 0 },
        { name: "In Progress", order: 1 },
        { name: "Done", order: 2 },
      ],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
