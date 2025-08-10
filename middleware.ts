import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProd = process.env.NODE_ENV === "production";

/** Build a Content-Security-Policy that works with Next.js */
function buildCSP() {
  const devUnsafeInline = isProd ? "" : " 'unsafe-inline'";
  const devUnsafeEval = isProd ? "" : " 'unsafe-eval'";
  
  // Add any domains your app needs below (fonts/CDN/analytics, etc.)
  const connectExtras: string[] = [
    // "https://vitals.vercel-insights.com", // remove if not using Vercel Analytics
  ];
  
  return [
    // baseline
    `default-src 'self'`,
    // scripts: no inline in prod; allow eval only in dev
    `script-src 'self'${devUnsafeEval} 'wasm-unsafe-eval' 'inline-speculation-rules'`,
    // styles: allow inline in dev to avoid headaches; consider removing in prod if you don't inline styles
    `style-src 'self'${devUnsafeInline}`,
    // images: allow blobs/data for avatars, placeholders, etc.
    `img-src 'self' blob: data:`,
    // fonts: self (add font CDNs if you use them)
    `font-src 'self'`,
    // XHR/fetch/websocket targets used by your frontend
    `connect-src 'self' ${connectExtras.join(" ")}`.trim(),
    // media/frames: none by default
    `media-src 'self'`,
    `frame-ancestors 'none'`,
    // object/embed: blocked
    `object-src 'none'`,
    // upgrade to https (HSTS handles this on repeat visits)
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join("; ");
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const res = NextResponse.next();
  
  // ----- 1) Write-route auth for /api/ideas -----
  const isIdeasApi = url.pathname.startsWith("/api/ideas");
  if (isIdeasApi) {
    const method = req.method.toUpperCase();
    const write = method === "POST" || method === "PATCH" || method === "DELETE";
    if (write) {
      const session = req.cookies.get("idea-vault-auth")?.value;
      if (session !== "true") {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
      }
    }
  }
  
  // ----- 2) Security headers on all app routes -----
  // Skip Next static assets, image optimizer, and favicon to avoid breaking them
  const isAsset = url.pathname.startsWith("/_next/") || 
                  url.pathname.startsWith("/static/") || 
                  url.pathname.startsWith("/images/") || 
                  url.pathname === "/favicon.ico";
  
  if (!isAsset) {
    // Content Security Policy
    res.headers.set("Content-Security-Policy", buildCSP());
    
    // Clickjacking / MIME sniffing / Referrer
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Referrer-Policy", "no-referrer");
    
    // Cross-origin isolation & resource policy (tighten if you embed cross-origin stuff)
    res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
    res.headers.set("Cross-Origin-Resource-Policy", "same-origin");
    
    // Permissions Policy (formerly Feature-Policy) — disable sensitive APIs by default
    // Add any you actually use (e.g., geolocation=*, camera=*, microphone=*)
    res.headers.set(
      "Permissions-Policy",
      [
        "camera=()",
        "microphone=()",
        "geolocation=()",
        "payment=()",
        "usb=()",
        "accelerometer=()",
        "ambient-light-sensor=()",
        "autoplay=()",
        "encrypted-media=()",
        "fullscreen=(self)",
        "gyroscope=()",
        "magnetometer=()",
        "midi=()",
        "xr-spatial-tracking=()",
      ].join(", ")
    );
    
    // HSTS: only in prod + behind HTTPS (Vercel is HTTPS by default)
    if (isProd) {
      res.headers.set(
        "Strict-Transport-Security",
        "max-age=63072000; includeSubDomains; preload"
      );
    }
  }
  
  return res;
}

// Run middleware on everything except static assets (defense-in-depth)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
