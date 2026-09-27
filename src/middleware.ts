import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect all /admin routes except /admin/login
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const authCookie = request.cookies.get('arca_auth_token');
    
    // In a real app we would verify the JWT, but for this simple password gate
    // checking if the cookie exists is a good first step. The cookie is set HttpOnly
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // If already logged in, don't show the login page
  if (path === '/admin/login') {
    const authCookie = request.cookies.get('arca_auth_token');
    if (authCookie && authCookie.value === 'authenticated') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
