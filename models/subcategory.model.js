import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory name must be unique"],
      minLength: [2, "Too Short name"],
      maxLength: [32, "Too Long name"],
    },

    slug: { type: String, lowercase: true },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Categories",
      required: [true, "Specify parent category"],
    },
  },
  { timestamps: true }
);

const SubCategoryModel = mongoose.model("SubCateogries", SubCategorySchema);

export default SubCategoryModel;
