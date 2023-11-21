"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseError = exports.paginateResults = exports.deleteImage = exports.deleteImageSupabase = exports.supabaseUpload = exports.sharpUpload = exports.deleteFile = exports.generateRefreshToken = exports.generateToken = void 0;
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const supabase_1 = require("../../src/lib/supabase");
const library_1 = require("@prisma/client/runtime/library");
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "1d" });
};
exports.generateToken = generateToken;
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "30d" });
};
exports.generateRefreshToken = generateRefreshToken;
const deleteFile = (filePath) => {
    // Check if the file exists
    fs.stat(filePath, (err, stats) => {
        if (err) {
            if (err.code === "ENOENT") {
                throw new Error("Image file does not exist.");
            }
            else {
                console.error("Error checking the image file:", err);
            }
        }
        else {
            // File exists, so delete it
            fs.unlink(filePath, (err) => {
                if (err) {
                    throw new Error("Error deleting the image file:");
                }
                else {
                    console.log("Image file has been deleted.");
                }
            });
        }
    });
};
exports.deleteFile = deleteFile;
const sharpUpload = (file, title) => __awaiter(void 0, void 0, void 0, function* () {
    //check if there no file to resize
    if (!file)
        throw new Error(`Image file not found`);
    const filename = `${title}-${Date.now()}.webp`;
    const pathUploadFile = "public/images/blogs/";
    const pathSave = "images/blogs/";
    const pathImage = pathSave + filename;
    // Ensure the directory exists, or create it
    if (!fs.existsSync(pathUploadFile)) {
        fs.mkdirSync(pathUploadFile, { recursive: true });
    }
    yield (0, sharp_1.default)(file.buffer)
        // .resize(500, 500)
        .toFormat("webp")
        .webp({
        quality: 70,
    })
        .toFile(path_1.default.join(pathUploadFile + filename));
    return pathImage;
});
exports.sharpUpload = sharpUpload;
const supabaseUpload = (file) => __awaiter(void 0, void 0, void 0, function* () {
    //check if there no file to resize
    console.log({ file });
    if (!file)
        throw new Error(`Image file not found`);
    // const filename = `${title}-${Date.now()}.webp`;
    const uploadImg = yield (0, supabase_1.supabaseUploadFile)(file, "blogs");
    if (uploadImg.error) {
        throw new Error(uploadImg.error.message);
    }
    const data = (0, supabase_1.supabaseGetPublicUrl)(uploadImg.filename, "blogs");
    return data.publicUrl;
});
exports.supabaseUpload = supabaseUpload;
const deleteImageSupabase = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = filename.split("/").slice(-1)[0];
    try {
        const { data, error } = yield (0, supabase_1.supabaseDeleteFile)(filePath, "blogs");
        if (error) {
            throw new Error("Error deleting image:");
        }
        else {
            console.log("Image deleted successfully:");
            console.log({ data });
        }
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.deleteImageSupabase = deleteImageSupabase;
// Function to delete an existing image file
const deleteImage = (imagePath) => __awaiter(void 0, void 0, void 0, function* () {
    yield fs.unlink(imagePath, (err) => {
        if (err) {
            throw new Error("Error deleting the image file:");
        }
        else {
            console.log("Image file has been deleted.");
        }
    });
});
exports.deleteImage = deleteImage;
const paginateResults = (req, res, model) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 2;
    const last_page = req.query.last_page;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const result = {
        totalCount: 0,
        totalPage: 0,
        currentPage: 0,
        data: [],
        currentCountPerPage: 0,
        range: 0,
    };
    try {
        const totalCount = yield model.count();
        const totalPage = Math.ceil(totalCount / limit);
        const currentPage = page || 0;
        if (page < 0) {
            return res.status(400).json("Page value should not be negative");
        }
        result.totalCount = totalCount;
        result.totalPage = totalPage;
        result.currentPage = currentPage;
        if (page === 1 && !last_page) {
            result.next = {
                page: page + 1,
                limit: limit,
            };
        }
        else if (endIndex < totalCount && !last_page) {
            result.next = {
                page: page + 1,
                limit: limit,
            };
        }
        else if (startIndex > 0 && !last_page) {
            result.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        else if (last_page === "true" && page === totalPage) {
            result.last = {
                page: totalPage,
                limit: limit,
            };
        }
        else {
            return res.status(404).json({ error: "Resource not found" });
        }
        result.data = yield model.findMany({
            take: limit,
            skip: startIndex,
            orderBy: {
                id: "desc",
            },
        });
        res.paginatedResult = result;
        result.currentCountPerPage = Object.keys(result.data).length;
        result.range = (currentPage - 1) * limit;
        return res.status(200).json(result);
    }
    catch (err) {
        console.error("error", err);
        return res.status(500).json(err);
    }
});
exports.paginateResults = paginateResults;
const responseError = (error, res, status) => {
    const resStatus = status ? status : 500;
    if (error instanceof library_1.PrismaClientValidationError) {
        console.error("Prisma Validation Error Message:");
        res.status(resStatus).json({
            message: `Prisma Validation Error Message`,
            error: error.message,
        });
    }
    else {
        console.error("Non-Prisma Validation Error:", error);
        res.status(resStatus).json({
            message: `Non-Prisma Validation Error`,
            error: error,
        });
    }
};
exports.responseError = responseError;
// // Function to save a new image with a specified path and name
// function saveImage(tempImagePath, newName) {
//   const destinationPath = path.join('public/images/blogs', newName);
//   fs.rename(tempImagePath, destinationPath, (err) => {
//     if (err) {
//       console.error('Error saving the new image:', err);
//     } else {
//       console.log('Image file has been saved to:', destinationPath);
//     }
//   });
// }
// // Example usage
// const existingImagePath = 'public/images/blogs/old_image.png'; // Replace with the existing image path
// deleteImage(existingImagePath);
// const tempImagePath = 'path/to/temp/image.png'; // Replace with the path to the new image
// const newImageName = 'new_image.png'; // Specify the name for the new image
// saveImage(tempImagePath, newImageName);
//# sourceMappingURL=helper.js.map