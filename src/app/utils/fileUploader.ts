import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import config from "../../config";
import { CloudinaryUploadResponse, IUploadedFile } from "../interface/file";
import { Readable } from "stream";

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret, // Click 'View API Keys' above to copy your API secret
});

// ? storage for local file system
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(process.cwd(), "uploads"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// ? storage for remote vercel system
// Use multer's memory storage to avoid filesystem writes
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  file: IUploadedFile
): Promise<CloudinaryUploadResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "uploads", // Optional: Specify a folder in your Cloudinary account
        public_id: file.originalname, // Optional: Use the original file name
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve(result as CloudinaryUploadResponse); // Resolve the upload result
      }
    );

    // Convert the file buffer to a readable stream and pipe it to Cloudinary
    Readable.from(file.buffer).pipe(stream);
  });
};

// Upload an image by cloudinary from local file system
// const uploadToCloudinary = async (file: IUploadedFile) => {
//   try {
//     const res = await cloudinary.uploader.upload(file.path, {
//       public_id: file.originalname,
//     });
//     // remove file from storage after upload success
//     fs.unlinkSync(file.path);
//     return res;
//   } catch (error) {
//     // remove file from storage if upload error
//     fs.unlinkSync(file.path);
//     console.log(error);
//   }
// };

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
