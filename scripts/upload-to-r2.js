const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

async function uploadDir(dirPath, bucketPath = "") {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const relativePath = path.join(bucketPath, file).replace(/\\/g, "/");

    if (fs.statSync(fullPath).isDirectory()) {
      await uploadDir(fullPath, relativePath);
    } else {
      console.log(`Uploading: ${relativePath}...`);
      const fileBuffer = fs.readFileSync(fullPath);
      
      const contentType = getContentType(file);

      try {
        await r2Client.send(
          new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: relativePath,
            Body: fileBuffer,
            ContentType: contentType,
          })
        );
        console.log(`✅ Success: ${relativePath}`);
      } catch (err) {
        console.error(`❌ Failed: ${relativePath}`, err);
      }
    }
  }
}

function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".webp": return "image/webp";
    case ".mp4": return "video/mp4";
    case ".svg": return "image/svg+xml";
    default: return "application/octet-stream";
  }
}

async function start() {
  console.log("🚀 Starting Bulk Upload to R2...");
  
  const publicDir = path.join(__dirname, "..", "public");
  
  // Upload images and videos
  if (fs.existsSync(path.join(publicDir, "images"))) {
    await uploadDir(path.join(publicDir, "images"), "images");
  }
  
  if (fs.existsSync(path.join(publicDir, "videos"))) {
    await uploadDir(path.join(publicDir, "videos"), "videos");
  }

  if (fs.existsSync(path.join(publicDir, "gallery"))) {
    await uploadDir(path.join(publicDir, "gallery"), "gallery");
  }

  console.log("\n🎉 All assets uploaded to Cloudflare R2!");
  console.log(`\nNext Step: Update your data files to use the R2 URLs.`);
}

start();
