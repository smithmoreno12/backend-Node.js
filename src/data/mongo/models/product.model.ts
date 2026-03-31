import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,
  },
  available: {
    type: Boolean,
    default: true,
  },

  price: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  img: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    const { _id, ...data } = ret;
    return data;
  },
});
export const ProductModel = mongoose.model("Product", productSchema);
