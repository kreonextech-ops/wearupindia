const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_URL || "";

export function getAssetUrl(path: string): string {
  if (!R2_PUBLIC_URL) return path;
  
  // If path starts with /, remove it
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${R2_PUBLIC_URL}/${cleanPath}`;
}
