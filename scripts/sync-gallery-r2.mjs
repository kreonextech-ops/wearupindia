import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

async function sync() {
  const localDir = 'public/gallery';
  const localFiles = fs.readdirSync(localDir);
  console.log(`Local files in ${localDir}: ${localFiles.length}`);

  const command = new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME,
    Prefix: 'gallery/',
  });

  const response = await r2Client.send(command);
  const r2Files = response.Contents
    ? response.Contents.map(item => item.Key.replace('gallery/', '')).filter(name => name !== '')
    : [];
  
  console.log(`Remote files in R2 gallery/: ${r2Files.length}`);

  const missingLocally = r2Files.filter(f => !localFiles.includes(f));
  console.log(`Files in R2 but MISSING locally (${missingLocally.length}):`);
  missingLocally.forEach(f => console.log(` - ${f}`));

  if (missingLocally.length > 0) {
    console.log('\nTo delete these from R2, run with --delete');
    if (process.argv.includes('--delete')) {
      for (const f of missingLocally) {
        console.log(`Deleting ${f} from R2...`);
        await r2Client.send(new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: `gallery/${f}`,
        }));
      }
      console.log('Cleanup complete.');
    }
  } else {
    console.log('R2 is in sync with local gallery.');
  }
}

sync().catch(console.error);
