import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authCookie = req.cookies.get("idea-vault-auth");
    
    if (authCookie?.value === "true") {
      return NextResponse.json({ 
        authenticated: true,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({ 
        authenticated: false,
        message: "No valid session found"
      }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
