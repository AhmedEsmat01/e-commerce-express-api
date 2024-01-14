import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand is Required"],
      unique: [true, "Brand name must be unique"],
      minLength: [3, "Too Short Brand name"],
      maxLength: [32, "Too Long Brand name"],
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
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

// return image base url (based on mode (production or testing))
BrandSchema.post("init", (doc) => modifyImageUrl(doc));
BrandSchema.post("save", (doc) => modifyImageUrl(doc));

const BrandModel = mongoose.model("Brands", BrandSchema);

export default BrandModel;
