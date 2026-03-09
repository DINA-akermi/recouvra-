const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["agent", "manager", "admin"],
      default: "agent",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }

  const hash = bcrypt.hashSync(this.password, 10);
  this.password = hash;
});

module.exports = mongoose.model("User", userSchema);