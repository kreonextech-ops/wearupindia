import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';

dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const instagramDir = path.join(process.cwd(), "video and photo", "homepage", "instagram");
const files = fs.readdirSync(instagramDir).filter(file => file.endsWith(".jpg"));

async function uploadFile(fileName) {
  const filePath = path.join(instagramDir, fileName);
  const fileBuffer = fs.readFileSync(filePath);

  console.log(`Uploading ${fileName}...`);
  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `instagram/${fileName}`,
        Body: fileBuffer,
        ContentType: "image/jpeg",
      })
    );
    console.log(`Successfully uploaded ${fileName}`);
  } catch (err) {
    console.error(`Error uploading ${fileName}:`, err);
  }
}

async function main() {
  for (const file of files) {
    await uploadFile(file);
  }
}

main();
