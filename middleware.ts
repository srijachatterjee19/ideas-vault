import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Protect write operations on /api/ideas
  if (url.pathname.startsWith("/api/ideas")) {
    const method = req.method.toUpperCase();
    const isWriteOperation = method === "POST" || method === "PATCH" || method === "DELETE";
    
    if (isWriteOperation) {
      const authCookie = req.cookies.get("idea-vault-auth");
      if (authCookie?.value !== "true") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/ideas/:path*"],
};
