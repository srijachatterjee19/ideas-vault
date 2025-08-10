import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Input validation schema
const LoginInput = z.object({
  password: z.string().min(1, "Password is required"),
});

// Rate limiting (simple in-memory store - use Redis in production)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown";
    const now = Date.now();
    const attempts = loginAttempts.get(ip);
    
    if (attempts && now < attempts.resetTime) {
      if (attempts.count >= MAX_ATTEMPTS) {
        return NextResponse.json(
          { error: "Too many login attempts. Please try again later." },
          { status: 429 }
        );
      }
    } else {
      // Reset window
      loginAttempts.set(ip, { count: 0, resetTime: now + WINDOW_MS });
    }
    
    // Validate input
    const body = await req.json();
    const parsed = LoginInput.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input format" },
        { status: 400 }
      );
    }
    
    const { password } = parsed.data;
    const expectedPassword = process.env.ADMIN_PASSWORD;
    
    if (!expectedPassword) {
      console.error("ADMIN_PASSWORD environment variable not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    
    // Increment attempt count
    const currentAttempts = loginAttempts.get(ip)!;
    currentAttempts.count++;
    
    // Constant-time comparison to prevent timing attacks
    if (!constantTimeCompare(password, expectedPassword)) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }
    
    // Reset attempts on successful login
    loginAttempts.delete(ip);
    
    const response = NextResponse.json({ success: true });
    
    // Set secure authentication cookie
    response.cookies.set("idea-vault-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Constant-time string comparison to prevent timing attacks
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
