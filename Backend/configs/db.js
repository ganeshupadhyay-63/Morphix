import dotenv from 'dotenv';
dotenv.config();

import { neon } from "@neondatabase/serverless";

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error(" DATABASE_URL is not set! Check your .env file.");
  throw new Error(
    "DATABASE_URL is not set! Make sure dotenv.config() runs before importing db.js"
  );
}

let sql;

try {
  // Initialize Neon client
  sql = neon(process.env.DATABASE_URL);
  console.log(" Neon DB client initialized successfully.");
} catch (error) {
  console.error(" Failed to initialize Neon DB client:", error);
  throw error;
}

export default sql;
