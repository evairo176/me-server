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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postImgResize = exports.profilePhotoResize = exports.photoUpload = void 0;
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
// storage
const multerStorage = multer.memoryStorage();
//file type checking..
const multerFilter = (req, file, callback) => {
    // check file type
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    }
    else {
        // rejected files
        callback({
            message: "Unsupported file format",
        }, false);
    }
};
exports.photoUpload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    },
});
//image resizing
const profilePhotoResize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //check if there no file to resize
    if (!req.file)
        return next();
    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
    yield sharp(req.file.buffer)
        .resize(950, 750)
        .toFormat("jpeg")
        .jpeg({
        quality: 90,
    })
        .toFile(path.join(`public/images/profile/${req.file.filename}`));
    next();
});
exports.profilePhotoResize = profilePhotoResize;
//Post image resizing
const postImgResize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //check if there no file to resize
    if (!req.file)
        return next();
    req.file.filename = `${Date.now()}-${req.file.originalname}`;
    yield sharp(req.file.buffer)
        // .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({
        quality: 90,
    })
        .toFile(path.join(`public/images/blogs/${req.file.filename}`));
    next();
});
exports.postImgResize = postImgResize;
module.exports = {
    photoUpload: exports.photoUpload,
    profilePhotoResize: exports.profilePhotoResize,
    postImgResize: exports.postImgResize,
};
//# sourceMappingURL=index.js.map