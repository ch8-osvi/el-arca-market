"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No se proporcionó ningún archivo" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `products/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read", // Allow public access so we can display it
    });

    await s3Client.send(command);

    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com/${fileName}`;
    return { success: true, url: imageUrl };
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return { success: false, error: error.message };
  }
}
