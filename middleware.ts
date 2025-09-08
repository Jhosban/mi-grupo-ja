import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

// Get the supported locales from environment variables
const locales = process.env.SUPPORTED_LOCALES?.split(',') || ['es-ES', 'en-US', 'es-CO'];
const defaultLocale = process.env.DEFAULT_LOCALE || 'es-ES';

// This function will be called for every request
export default async function middleware(request: NextRequest) {
  // Create the middleware
  const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always'
  });

  // Check if the pathname is the root
  if (request.nextUrl.pathname === '/') {
    // Redirect to the default locale
    return Response.redirect(new URL(`/${defaultLocale}/chat`, request.url));
  }

  // Apply the intl middleware for all other routes
  return intlMiddleware(request);
}

// Configure the middleware to match certain paths
export const config = {
  matcher: ['/', '/(es-ES|en-US|es-CO)/:path*']
};
