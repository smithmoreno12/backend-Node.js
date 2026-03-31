import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  img: {
    type: String,
  },
  role: {
    type: [String],
    enum: ["USER_ROLE", "ADMIN_ROLE"],
    default: "USER_ROLE",
  },
});
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    const { _id, password, ...data } = ret;
    return data;
  },
});

export const UserModel = mongoose.model("User", userSchema);
