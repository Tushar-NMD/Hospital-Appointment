import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/api/auth-guard";
import { uploadPhoto } from "@/lib/cloudinary";
import { success, error } from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const { photo } = await req.json();
    if (!photo) return error("Photo is required");

    const url = photo.startsWith("data:")
      ? await uploadPhoto(photo)
      : photo;

    return success({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return error("Upload failed", 500);
  }
}
