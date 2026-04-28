import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  const subdomain = hostname.split('.')[0]

  // Admin Access Validation Logic
  const checkAdminAccess = async () => {
    if (!user) return false;
    
    // Explicitly allow this specific user
    if (user.email === 'tanumaykhasnobish66@gmail.com') {
      return true;
    }

    // Check if user is an admin in the profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    return profile?.role === 'admin';
  };

  // 1. Handle Admin Subdomain Protection
  if (subdomain === 'admin') {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url).toString().replace('admin.', ''))
    }

    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      // Redirect standard users back to the storefront
      return NextResponse.redirect(new URL('/', request.url).toString().replace('admin.', ''))
    }

    // Rewrite to internal admin route
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }

  // 1.5 Handle Admin Path Protection (Localhost or direct path access)
  if (url.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    const isAdmin = await checkAdminAccess();
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // 2. Protect Authenticated Routes (Storefront)
  const protectedRoutes = ['/checkout', '/profile', '/wishlist']
  if (protectedRoutes.some(path => url.pathname.startsWith(path)) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
