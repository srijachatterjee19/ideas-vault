import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const startTime = Date.now();
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "unknown",
    checks: {
      database: "unknown",
      memory: "unknown",
      disk: "unknown"
    },
    metrics: {
      responseTime: 0,
      memoryUsage: process.memoryUsage(),
      databaseConnections: 0
    }
  };

  try {
    // Check database connectivity
    const dbStart = Date.now();
    
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      health.checks.database = "unconfigured";
      health.status = "degraded";
    } else {
      try {
        await prisma.$queryRaw`SELECT 1`;
        const dbTime = Date.now() - dbStart;
        
        health.checks.database = "healthy";
        health.metrics.databaseConnections = 1;
        health.metrics.responseTime = dbTime;
      } catch (dbError) {
        health.checks.database = "unhealthy";
        health.status = "degraded";
        console.error("Database health check failed:", dbError);
      }
    }

    // Check memory usage
    const memUsage = process.memoryUsage();
    const memUsageMB = memUsage.heapUsed / 1024 / 1024;
    
    if (memUsageMB < 500) { // Less than 500MB
      health.checks.memory = "healthy";
    } else if (memUsageMB < 1000) { // Less than 1GB
      health.checks.memory = "warning";
    } else {
      health.checks.memory = "critical";
      health.status = "degraded";
    }

    // Check disk space (basic check)
    health.checks.disk = "healthy"; // In production, you might want to check actual disk space

    // Determine overall status
    if (health.checks.database === "healthy" && 
        health.checks.memory === "healthy" && 
        health.checks.disk === "healthy") {
      health.status = "healthy";
    } else if (health.checks.database === "healthy") {
      health.status = "degraded";
    } else {
      health.status = "unhealthy";
    }

  } catch (error) {
    health.checks.database = "unhealthy";
    health.status = "unhealthy";
    health.metrics.responseTime = Date.now() - startTime;
    
    console.error("Health check failed:", error);
    
    return NextResponse.json(health, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }

  const responseTime = Date.now() - startTime;
  health.metrics.responseTime = responseTime;

  const statusCode = health.status === "healthy" ? 200 : 
                    health.status === "degraded" ? 200 : 503;

  return NextResponse.json(health, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
