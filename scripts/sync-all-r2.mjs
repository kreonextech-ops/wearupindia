import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
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

const isDelete = process.argv.includes('--delete');

async function syncPrefix(prefix, localPath) {
  console.log(`\n--- Syncing ${prefix} with ${localPath} ---`);
  
  if (!fs.existsSync(localPath)) {
    console.log(`Local path ${localPath} does not exist. Skipping.`);
    return;
  }

  // Get local files (including subdirectories recursively)
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
        results.push(relativePath);
      }
    });
    return results;
  };

  const localFiles = getLocalFiles(localPath);
  console.log(`Local files in ${localPath}: ${localFiles.length}`);

  // Get remote files
  const command = new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME,
    Prefix: prefix,
  });
  
  const response = await r2Client.send(command);
  const remoteKeys = (response.Contents || []).map(item => item.Key);
  const remoteFiles = remoteKeys.map(key => key.replace(prefix, ''));
  
  console.log(`Remote files in R2 ${prefix}: ${remoteFiles.length}`);

  const orphanRemote = remoteKeys.filter(key => {
    const relativeKey = key.replace(prefix, '');
    return !localFiles.includes(relativeKey);
  });

  if (orphanRemote.length > 0) {
    console.log(`Found ${orphanRemote.length} orphan files in R2:`);
    orphanRemote.forEach(k => console.log(` - ${k}`));
    
    if (isDelete) {
      console.log(`Deleting ${orphanRemote.length} files from R2...`);
      for (const key of orphanRemote) {
        await r2Client.send(new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
        }));
        console.log(` DELETED: ${key}`);
      }
    } else {
      console.log(`Run with --delete to remove these from R2.`);
    }
  } else {
    console.log("R2 is in sync with local folder.");
  }
}

async function main() {
  await syncPrefix('gallery/', path.join(__dirname, '../public/gallery'));
  await syncPrefix('videos/', path.join(__dirname, '../public/videos'));
  await syncPrefix('images/', path.join(__dirname, '../public/images'));
}

main().catch(console.error);
