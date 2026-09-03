const mongoose = require("mongoose");
const { ROLES } = require("../../constants/roles");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },

    refreshToken: {
      type: String,
      default: "",
    },

    refreshTokenExpiresAt: {
      type: Date,
      default: null,
    },

    skills: {
      type: [String],
      default: [],
    },

    availability: {
      status: {
        type: String,
        enum: ["available", "unavailable"],
        default: "available",
      },

      hoursPerDay: {
        type: Number,
        min: 0,
        max: 24,
        default: 8,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field
userSchema.virtual("capacityHours").get(function () {
  return this.availability &&
    typeof this.availability.hoursPerDay === "number"
    ? this.availability.hoursPerDay * 5
    : 40;
});

// Include virtual fields in responses
userSchema.set("toJSON", {
  virtuals: true,
});

userSchema.set("toObject", {
  virtuals: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;