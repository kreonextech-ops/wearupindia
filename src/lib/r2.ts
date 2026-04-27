import { S3Client } from "@aws-sdk/client-s3";
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
  // If you use a custom domain: https://assets.wearup.in/path
  // If you use the R2 dev domain, you'll need that here
  const baseUrl = process.env.R2_PUBLIC_URL || `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.dev`;
  return `${baseUrl}/${path}`;
}
