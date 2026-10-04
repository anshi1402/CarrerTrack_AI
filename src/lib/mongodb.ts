import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Node.js SRV DNS resolution on Windows and certain ISPs
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // Ignore if not permitted in specific runtime
}

/**
 * Global cache interface for Mongoose connection in serverless / hot-reload environments.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log('✅ Connected to MongoDB Atlas successfully');
      return mongooseInstance;
    }).catch((err) => {
      console.error('❌ MongoDB Atlas connection error:', err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    return null;
  }
}

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.trim().length > 0);
}

export function getMongoConnectionState(): string {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
}
