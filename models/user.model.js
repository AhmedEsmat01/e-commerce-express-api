import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: [true, "name is required"] },
    slug: { type: String, lowercase: true },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
      lowercase: true,
    },
    phone: { type: String },
    profileImage: String,
    password: {
      type: String,
      required: true,
      minLength: [6, "too short password"],
    },
    passwordChangedAt: { type: Date, default: Date.now() },
    passwordResetCode: String,
    passwordResetCodeExpiresIn: Date,
    resetPasswordCodeVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin", "manager"], default: "user" },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = bcrypt.hashSync(
    this.password,
    parseInt(process.env.SALT_ROUNDS)
  );

  next();
});

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
