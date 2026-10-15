import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { MongoClient } from 'mongodb';

const mongoUri =
  process.env.BETTER_AUTH_DB_URL ||
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  'mongodb://localhost:27017/bazardor';

let client: MongoClient;
if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & { _mongoClient?: MongoClient };
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(mongoUri);
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(mongoUri);
}

const dbName = process.env.BETTER_AUTH_DB_NAME || process.env.MONGODB_DB_NAME || 'bazardor';
const db = client.db(dbName);

const googleClientId = process.env.BETTER_AUTH_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '';
const googleClientSecret = process.env.BETTER_AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || '';
const githubClientId = process.env.BETTER_AUTH_GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID || '';
const githubClientSecret = process.env.BETTER_AUTH_GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET || '';

const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};

if (googleClientId && googleClientSecret) {
  socialProviders.google = { clientId: googleClientId, clientSecret: googleClientSecret };
}

if (githubClientId && githubClientSecret) {
  socialProviders.github = { clientId: githubClientId, clientSecret: githubClientSecret };
}

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  socialProviders,
  plugins: [nextCookies()],
});
