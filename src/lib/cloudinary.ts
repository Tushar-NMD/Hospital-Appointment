import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadPhoto(
  file: string,
  folder = "medcare/profiles"
): Promise<string> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    transformation: [{ width: 400, height: 400, crop: "fill", quality: "auto" }],
  });
  return result.secure_url;
}

export { cloudinary };
