import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadToR2(file: File, path: string) {
  const arrayBuffer = await file.arrayBuffer();
  
  const upload = new Upload({
    client: r2Client,
    params: {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: path,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type,
    },
  });

  await upload.done();
  
  // Return the public URL
  // Priority: 
  // 1. R2_PUBLIC_URL environment variable
  // 2. Cloudflare R2 Dev Domain (pub-<account-id>.r2.dev)
  const baseUrl = process.env.R2_PUBLIC_URL || `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev`;
  return `${baseUrl}/${path}`;
}

export async function deleteFromR2(path: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: path,
    });
    await r2Client.send(command);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting from R2:", error);
    return { success: false, error: error.message };
  }
}

export async function listGalleryFiles(): Promise<string[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: 'gallery/',
    });
    
    const response = await r2Client.send(command);
    if (!response.Contents) return [];
    
    // Extract filename from the key (e.g., 'gallery/image.jpg' -> 'image.jpg')
    return response.Contents
      .map(item => item.Key?.replace('gallery/', '') || '')
      .filter(name => name && /\.(jpg|jpeg|png|mp4)$/i.test(name));
  } catch (error) {
    console.error("Error listing R2 files:", error);
    return [];
  }
}
