import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category is Required"],
      unique: [true, "Category name must be unique"],
      minLength: [3, "Too Short Category name"],
      maxLength: [32, "Too Long Category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const modifyImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

// return image base url (based on mode (production or testing))
categorySchema.post("init", (doc) => modifyImageUrl(doc));
categorySchema.post("save", (doc) => modifyImageUrl(doc));

const CategoryModel = mongoose.model("Categories", categorySchema);

export default CategoryModel;
