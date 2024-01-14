import mongoose from "mongoose";
import dotenv from "dotenv";
import UserModel from "../models/user.model.js";

dotenv.config({ path: "../.env" });

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => console.log(`Database Connected `));
};

export default dbConnection;
