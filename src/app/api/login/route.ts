import { NextRequest, NextResponse } from "next/server";

const PASSWORD = process.env.ADMIN_PASSWORD || "dev-secret";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    if (password === PASSWORD) {
      const response = NextResponse.json({ success: true });
      
      // Set authentication cookie
      response.cookies.set("idea-vault-auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
      });
      
      return response;
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
