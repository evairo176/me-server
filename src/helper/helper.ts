import path from "path";
import sharp from "sharp";
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
import mkdirp from "mkdirp";
import {
  supabaseDeleteFile,
  supabaseGetPublicUrl,
  supabaseUpdateFile,
  supabaseUploadFile,
} from "../../src/lib/supabase";

export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "1m" });
};
export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "1d" });
};

export const deleteFile = (filePath: any) => {
  // Check if the file exists
  fs.stat(filePath, (err: any, stats: any) => {
    if (err) {
      if (err.code === "ENOENT") {
        throw new Error("Image file does not exist.");
      } else {
        console.error("Error checking the image file:", err);
      }
    } else {
      // File exists, so delete it
      fs.unlink(filePath, (err: any) => {
        if (err) {
          throw new Error("Error deleting the image file:");
        } else {
          console.log("Image file has been deleted.");
        }
      });
    }
  });
};

export const sharpUpload = async (file: any, title: string) => {
  //check if there no file to resize

  if (!file) throw new Error(`Image file not found`);
  const filename = `${title}-${Date.now()}.webp`;
  const pathUploadFile = "public/images/blogs/";
  const pathSave = "images/blogs/";
  const pathImage = pathSave + filename;

  // Ensure the directory exists, or create it
  if (!fs.existsSync(pathUploadFile)) {
    fs.mkdirSync(pathUploadFile, { recursive: true });
  }

  await sharp(file.buffer)
    // .resize(500, 500)
    .toFormat("webp")
    .webp({
      quality: 70,
    })
    .toFile(path.join(pathUploadFile + filename));

  return pathImage;
};

export const supabaseUpload = async (file: any) => {
  //check if there no file to resize
  console.log({ file });
  if (!file) throw new Error(`Image file not found`);
  // const filename = `${title}-${Date.now()}.webp`;

  const uploadImg = await supabaseUploadFile(file, "blogs");
  if (uploadImg.error) {
    throw new Error(uploadImg.error.message);
  }

  const data = supabaseGetPublicUrl(uploadImg.filename, "blogs");

  return data.publicUrl;
};

export const deleteImageSupabase = async (filename: string) => {
  const filePath = filename.split("/").slice(-1)[0];
  try {
    const { data, error } = await supabaseDeleteFile(filePath, "blogs");

    if (error) {
      throw new Error("Error deleting image:");
    } else {
      console.log("Image deleted successfully:");
      console.log({ data });
    }
  } catch (error) {
    throw new Error(error);
  }
};

// Function to delete an existing image file
export const deleteImage = async (imagePath: string) => {
  await fs.unlink(imagePath, (err: any) => {
    if (err) {
      throw new Error("Error deleting the image file:");
    } else {
      console.log("Image file has been deleted.");
    }
  });
};

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
