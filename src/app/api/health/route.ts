import { NextResponse } from 'next/server';
import { isMongoConfigured, getMongoConnectionState, connectToDatabase } from '@/lib/mongodb';
import { dbRepo } from '@/lib/db';

export async function GET() {
  const startTime = Date.now();
  let mongoStatus = 'not_configured';
  let databaseDriver = 'local_json_fallback';
  let roadmapsCount = 0;

  try {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        mongoStatus = getMongoConnectionState();
        databaseDriver = 'mongodb_atlas';
      } else {
        mongoStatus = 'connection_failed';
      }
    }

    const roadmaps = await dbRepo.getAllRoadmaps();
    roadmapsCount = roadmaps.length;

    const responseTimeMs = Date.now() - startTime;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      database: {
        driver: databaseDriver,
        isMongoConfigured: isMongoConfigured(),
        mongoConnectionState: mongoStatus,
        roadmapsLoaded: roadmapsCount,
      },
      system: {
        nodeVersion: process.version,
        memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        responseTimeMs,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'degraded',
        error: error.message || 'Health check error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
