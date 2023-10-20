const jwt = require("jsonwebtoken");
const fs = require("fs");

export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "20d" });
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
          throw new Error("Error deleting the image file:", err);
        } else {
          console.log("Image file has been deleted.");
        }
      });
    }
  });
};

// const fs = require('fs');
// const path = require('path');

// // Function to delete an existing image file
// function deleteImage(imagePath) {
//   fs.unlink(imagePath, (err) => {
//     if (err) {
//       console.error('Error deleting the image file:', err);
//     } else {
//       console.log('Image file has been deleted.');
//     }
//   });
// }

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
