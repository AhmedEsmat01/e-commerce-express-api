import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import ApiFeature from "../utils/ApiFeatures.js";

export const deleteOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const result = await Model.findByIdAndDelete(id);

    if (!result) {
      return next(new ApiError(`result not found for id : ${id}`, 404));
    }
    res.status(204).send();
  });
};

export const updateOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const result = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!result) {
      return next(new ApiError(`result not found for id : ${id}`, 404));
    }
    res.status(200).json({ data: result });
  });
};

export const createOne = (Model) => {
  return asyncHandler(async (req, res) => {
    const result = await Model.create(req.body);
    res.status(201).json(result);
  });
};

export const getOne = (Model) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const result = await Model.findById(id);

    if (!result) {
      return next(new ApiError(`result not found for id : ${id}`, 404));
    }
    res.status(200).json({ data: result });
  });
};

export const getAll = (Model) => {
  return asyncHandler(async (req, res) => {
    const apiFeature = new ApiFeature(Model.find(), req.query)
      .paginate()
      .filter()
      .search()
      .limitFields()
      .sort();

    const result = await apiFeature.query;
    const page = apiFeature.queryString.page;

    res.status(200).json({ results: result.length, page, data: result });
  });
};
