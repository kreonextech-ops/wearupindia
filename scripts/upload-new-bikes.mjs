import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const BASE = path.join(__dirname, "..", "public");

const FILES = [
  { local: "images/brands/triumph.jpeg",                         r2Key: "images/brands/triumph.jpeg" },
  { local: "images/models/hero/xpulse210.jpeg",                  r2Key: "images/models/hero/xpulse210.jpeg" },
  { local: "images/models/triumph/street-triple-765-rs.jpeg",    r2Key: "images/models/triumph/street-triple-765-rs.jpeg" },
];

async function upload() {
  console.log("🚀 Uploading 3 new bike images to Cloudflare R2...\n");

  for (const { local, r2Key } of FILES) {
    const fullPath = path.join(BASE, local);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${fullPath}`);
      continue;
    }
    const body = fs.readFileSync(fullPath);
    const ext = path.extname(local).toLowerCase();
    const contentType = ext === ".png" ? "image/png" : "image/jpeg";

    try {
      await r2Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: r2Key,
        Body: body,
        ContentType: contentType,
      }));
      const publicUrl = `${process.env.NEXT_PUBLIC_R2_URL}/${r2Key}`;
      console.log(`✅ ${r2Key}`);
      console.log(`   → ${publicUrl}\n`);
    } catch (err) {
      console.error(`❌ Failed: ${r2Key}`, err.message);
    }
  }

  console.log("🎉 Done! All new bike images are live on R2.");
}

upload();
