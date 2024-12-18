//? interface for uploading local file system
// export interface IUploadedFile {
//   fieldname: string; // The name of the form field associated with the file
//   originalname: string; // The original name of the uploaded file
//   encoding: string; // The encoding type of the file
//   mimetype: string; // The MIME type of the file
//   destination: string; // The folder where the file is saved
//   filename: string; // The name of the file within the destination folder
//   path: string; // The full path to the uploaded file
//   size: number; // The size of the file in bytes
// }

//? interface for remote vercel file system
export interface IUploadedFile extends Express.Multer.File {}

export interface CloudinaryUploadResponse {
  public_id: string; // Unique identifier for the uploaded file
  version: number; // Version number of the asset
  width: number; // Width of the uploaded image
  height: number; // Height of the uploaded image
  format: string; // File format (e.g., 'jpg', 'png')
  resource_type: string; // Resource type (e.g., 'image', 'video')
  secure_url: string; // The HTTPS URL of the uploaded asset
  url: string; // HTTP URL of the uploaded asset
  [key: string]: any; // Additional properties
}
