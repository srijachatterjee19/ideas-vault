import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Check if this is a production environment
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        { error: "Setup can only be run in production" },
        { status: 403 }
      );
    }

    // Check for admin password
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    if (token !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid admin password" },
        { status: 401 }
      );
    }

    console.log("Starting database setup...");

    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connection successful");

    // Check if tables exist
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Idea'
      );
    `;

    const exists = Array.isArray(tableExists) && 
                   tableExists[0] && 
                   typeof tableExists[0] === 'object' && 
                   'exists' in tableExists[0] && 
                   tableExists[0].exists;

    if (exists) {
      return NextResponse.json({
        success: true,
        message: "Database is already set up",
        tables: "Idea table found"
      });
    }

    // Tables don't exist - provide setup instructions
    return NextResponse.json({
      success: false,
      message: "Database tables don't exist. Manual setup required.",
      instructions: [
        "1. Connect to your production database",
        "2. Run: npx prisma migrate deploy",
        "3. Or use Prisma Studio: npx prisma studio",
        "4. Alternative: Use Neon's SQL editor to run migrations"
      ],
      action: "Run migrations manually or use database management tools"
    });

  } catch (error) {
    console.error("Database setup check failed:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
        help: "Make sure your DATABASE_URL is correct and the database is accessible"
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
