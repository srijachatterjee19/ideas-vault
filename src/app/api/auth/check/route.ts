import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authCookie = req.cookies.get("idea-vault-auth");
  
  if (authCookie?.value === "true") {
    return NextResponse.json({ authenticated: true });
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
