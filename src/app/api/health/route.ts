import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";

export async function GET() {
  try {
    const checks = {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks: {
        mongodbUri: !!process.env.MONGODB_URI,
        jwtSecret: !!process.env.JWT_SECRET,
        cloudinary: !!(
          process.env.CLOUDINARY_CLOUD_NAME &&
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_SECRET
        ),
        resend: !!process.env.RESEND_API_KEY,
      },
    };

    // Test MongoDB connection
    try {
      await connectDB();
      checks.checks = {
        ...checks.checks,
        mongodbConnection: true,
      };
    } catch (err) {
      checks.checks = {
        ...checks.checks,
        mongodbConnection: false,
      };
      checks.status = "error";
    }

    const allChecks = Object.values(checks.checks).every((v) => v === true);
    
    if (!allChecks) {
      checks.status = "error";
    }

    return NextResponse.json(checks, {
      status: allChecks ? 200 : 500,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
