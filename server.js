import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import dbConnection from "./config/database.config.js";
import ApiError from "./utils/ApiError.js";
import globalErrorHandler from "./middlewares/error.middleware.js";
import categoryRoute from "./routes/category.route.js";
import subCategoryRoute from "./routes/subcategory.route.js";
import brandRouter from "./routes/brand.route.js";
import productRoute from "./routes/product.route.js";
import userRoute from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import UserModel from "./models/user.model.js";

//enviroment variables
dotenv.config();

//Database Connection
dbConnection();

//express app
const app = express();

//body parser
app.use(express.json());

//serve static files
app.use(express.static(`uploads`));

//logger
app.use(morgan("dev"));

//Mount Routes
app.use("/api/category", categoryRoute);
app.use("/api/subcategory", subCategoryRoute);
app.use("/api/brands", brandRouter);
app.use("/api/product", productRoute);
app.use("/api/user", userRoute);
app.use("/api/auth", authRouter);

app.all("*", (req, res, next) => {
  next(new ApiError(`Invalid Route ${req.originalUrl}`, 400));
});

//Global Error Handler Middleware
app.use(globalErrorHandler);

const port = parseInt(process.env.PORT) || 8000;
const server = app.listen(port, async () => {
  console.log(`App Running on port ${port}`);
});

//Handle events outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection error ${err}`);
  server.close(() => {
    console.log(`Application shutdown`);
    process.exit(1);
  });
});
