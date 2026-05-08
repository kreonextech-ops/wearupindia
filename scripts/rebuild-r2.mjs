import { S3Client, ListObjectsV2Command, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET = process.env.R2_BUCKET_NAME;

async function clearPrefix(prefix) {
  console.log(`\n--- Deleting all files in R2 with prefix: ${prefix} ---`);
  let isTruncated = true;
  let continuationToken = undefined;
  let deleteCount = 0;

  while (isTruncated) {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    });

    const response = await r2Client.send(listCommand);
    
    if (response.Contents && response.Contents.length > 0) {
      for (const item of response.Contents) {
        await r2Client.send(new DeleteObjectCommand({
          Bucket: BUCKET,
          Key: item.Key,
        }));
        console.log(`Deleted: ${item.Key}`);
        deleteCount++;
      }
    }
    
    isTruncated = response.IsTruncated;
    continuationToken = response.NextContinuationToken;
  }
  
  console.log(`Total deleted from ${prefix}: ${deleteCount}`);
}

async function uploadFolder(localPath, prefix) {
  console.log(`\n--- Uploading files from ${localPath} to R2 prefix: ${prefix} ---`);
  
  if (!fs.existsSync(localPath)) {
    console.log(`Local path ${localPath} does not exist. Skipping.`);
    return;
  }

  const getLocalFiles = (dir, base = '') => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const relativePath = path.join(base, file).replace(/\\/g, '/');
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getLocalFiles(fullPath, relativePath));
      } else {
        results.push({ fullPath, relativePath });
      }
    });
    return results;
  };

  const files = getLocalFiles(localPath);
  console.log(`Found ${files.length} local files in ${localPath}`);

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.mp4':
      return 'video/mp4';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

  let uploadCount = 0;
  for (const file of files) {
    const key = `${prefix}${file.relativePath}`;
    const contentType = getContentType(file.fullPath);
    const fileStream = fs.readFileSync(file.fullPath);

    try {
      await r2Client.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: fileStream,
        ContentType: contentType,
      }));
      console.log(`Uploaded: ${key}`);
      uploadCount++;
    } catch (err) {
      console.error(`Failed to upload ${key}:`, err.message);
    }
  }
  
  console.log(`Total uploaded to ${prefix}: ${uploadCount}`);
}

async function main() {
  // 1. Delete gallery/ prefix from R2
  await clearPrefix('gallery/');
  
  // 2. Upload video, images (photo), and gallery folders to R2
  // We'll upload them to their respective prefixes
  await uploadFolder(path.join(__dirname, '../public/gallery'), 'gallery/');
  
  console.log("\n--- Now uploading videos and photos as requested ---");
  await uploadFolder(path.join(__dirname, '../public/videos'), 'videos/');
  await uploadFolder(path.join(__dirname, '../public/images'), 'images/');
  
  console.log("\nAll done!");
}

main().catch(console.error);
