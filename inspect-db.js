#!/usr/bin/env node
/**
 * MongoDB Database Inspector
 * 
 * Quick tool to inspect what's stored in your MongoDB Atlas database
 * without needing to use the web UI or command line mongosh.
 * 
 * Usage: node inspect-db.js
 * 
 * Make sure MONGO_URI is set in your .env file!
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

async function inspectDatabase() {
  if (!MONGO_URI) {
    console.error(`${colors.yellow}⚠️  MONGO_URI not found in .env${colors.reset}`);
    process.exit(1);
  }

  console.log(`\n${colors.bright}${colors.cyan}═══ MongoDB Database Inspector ═══${colors.reset}\n`);
  console.log(`Connecting to: ${MONGO_URI.split('@')[1] || 'MongoDB Atlas'}\n`);

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`${colors.green}✅ Connected to MongoDB${colors.reset}\n`);

    // Get database reference
    const db = mongoose.connection.db;

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(`${colors.bright}Found ${collections.length} Collections:${colors.reset}\n`);

    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await db.collection(collectionName).countDocuments();

      console.log(`${colors.magenta}📦 ${collectionName}${colors.reset} (${count} documents)\n`);

      if (count === 0) {
        console.log(`  ${colors.yellow}(empty)${colors.reset}\n`);
        continue;
      }

      // Get sample documents (max 3)
      const limit = count <= 3 ? count : 3;
      const documents = await db
        .collection(collectionName)
        .find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

      documents.forEach((doc, idx) => {
        console.log(`  ${colors.blue}[${idx + 1}]${colors.reset}`);
        console.log(`    ${JSON.stringify(doc, null, 4)}`);
        console.log();
      });

      if (count > limit) {
        console.log(`  ${colors.yellow}... and ${count - limit} more documents${colors.reset}\n`);
      }
    }

    // Summary statistics
    console.log(`\n${colors.bright}═══ Summary ═══${colors.reset}\n`);

    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`  ${collection.name}: ${colors.green}${count}${colors.reset}`);
    }

    console.log();

  } catch (error) {
    console.error(`${colors.yellow}❌ Error: ${error.message}${colors.reset}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

inspectDatabase();
