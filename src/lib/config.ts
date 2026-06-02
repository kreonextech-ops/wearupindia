/**
 * Shared Application Configuration
 * 
 * This module centralizes environment variable access and provides 
 * defensive fallbacks and validation to prevent runtime crashes.
 * 
 * NOTE: For browser-side access, NEXT_PUBLIC_ variables must be accessed 
 * statically (not via dynamic keys like process.env[key]) due to Next.js compilation rules.
 */

export const config = {
  supabase: {
    // Specifically mapped for client-side static replacement
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://wearupindia.com',
    name: 'WearUp',
    description: 'Ride Bold. Wrap Louder. Premium motorcycle wraps and customization.',
  },
  assets: {
    placeholder: '/placeholder.png',
  },
  isProd: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV === 'development',
};

// Validate critical config
export const validateConfig = () => {
  const missing = [];
  if (!config.supabase.url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!config.supabase.anonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  if (missing.length > 0) {
    if (typeof window !== 'undefined') {
      console.warn(`[WearUp Client] Configuration is missing critical keys. Authentication features may fail.`);
    } else {
      console.error(`[WearUp Server] FATAL: Missing keys: ${missing.join(', ')}`);
    }
    return false;
  }
  return true;
};
