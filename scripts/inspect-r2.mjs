import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from "path";
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

async function listAllKeys() {
  console.log(`Listing all keys in bucket: ${process.env.R2_BUCKET_NAME}`);
  const command = new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME,
  });
  
  const response = await r2Client.send(command);
  if (!response.Contents) {
    console.log("No contents found.");
    return;
  }
  
  const keys = response.Contents.map(c => c.Key);
  const prefixes = new Set();
  keys.forEach(k => {
    const parts = k.split('/');
    if (parts.length > 1) {
      prefixes.add(parts[0] + '/');
    } else {
      prefixes.add('(root)');
    }
  });
  
  console.log("Prefixes found:", Array.from(prefixes));
  console.log(`Total keys: ${keys.length}`);
  
  // Group by prefix
  const groups = {};
  keys.forEach(k => {
    const prefix = k.includes('/') ? k.split('/')[0] + '/' : '(root)';
    if (!groups[prefix]) groups[prefix] = 0;
    groups[prefix]++;
  });
  
  console.log("Distribution:", groups);
}

listAllKeys();
