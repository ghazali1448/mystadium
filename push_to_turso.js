import { createClient } from '@libsql/client';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("❌ Error: DATABASE_URL and TURSO_AUTH_TOKEN must be set in your .env file.");
  process.exit(1);
}

async function pushSchema() {
  console.log("🛠️  Generating SQL from Prisma schema...");
  
  try {
    // Generate SQL using Prisma CLI
    const sql = execSync('npx prisma migrate diff --from-empty --to-schema-datamodel server/prisma/schema.prisma --script').toString();
    
    console.log("🚀 Connecting to Turso...");
    const client = createClient({ url, authToken });
    
    console.log("📝 Executing SQL on Turso...");
    
    // Split SQL into individual statements because Turso execute() handles one at a time or batch
    // We'll use the batch method for simplicity
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    await client.batch(statements, "write");
    
    console.log("✅ Success! Your database schema has been pushed to Turso.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to push schema:", error.message);
    process.exit(1);
  }
}

pushSchema();
