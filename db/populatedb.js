const { Client } = require("pg");
require("dotenv").config();
const path=require("node:path")
const fs = require('fs');
const SQL = `
CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name VARCHAR(60),
      description VARCHAR(200)
    );
    
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name VARCHAR(60),
      description VARCHAR(200),
      quantity INTEGER,
      price INTEGER
    );
    
    CREATE TABLE IF NOT EXISTS categories_items (
      category_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      PRIMARY KEY (item_id, category_id),
      FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
`;

async function runMigrations() {
  // const client = new Client({
  //   connectionString: process.env.CONNECTION_STRING
  // });
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING,
    ssl: {
      ca: fs.readFileSync(path.resolve(process.env.DB_SSL_CERT)).toString(),
      rejectUnauthorized: true 
    }
  });

  try {
    console.log("Connecting to database...");
    await client.connect();
    
    console.log("Running migrations...");
    await client.query(SQL);
    
    console.log("Migrations completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
    console.log("Disconnected from database");
  }
}

runMigrations();