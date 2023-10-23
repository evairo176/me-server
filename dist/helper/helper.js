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
exports.deleteImage = exports.sharpUpload = exports.deleteFile = exports.generateToken = void 0;
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "20d" });
};
exports.generateToken = generateToken;
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