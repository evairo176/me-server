const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// storage
const multerStorage = multer.memoryStorage();

//file type checking..
const multerFilter = (req: any, file: any, callback: any) => {
  // check file type
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    // rejected files
    callback(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

export const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000000 },
});

//image resizing
export const profilePhotoResize = async (req: any, res: any, next: any) => {
  //check if there no file to resize
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(950, 750)
    .toFormat("jpeg")
    .jpeg({
      quality: 90,
    })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));
  next();
};

//Post image resizing
export const postImgResize = async (req: any, res: any, next: any) => {
  //check if there no file to resize
  if (!req.file) return next();
  req.file.filename = `${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    // .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({
      quality: 90,
    })
    .toFile(path.join(`public/images/blogs/${req.file.filename}`));
  next();
};

module.exports = {
  photoUpload,
  profilePhotoResize,
  postImgResize,
};
