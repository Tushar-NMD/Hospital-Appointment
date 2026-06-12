import { config } from "dotenv";
import mongoose from "mongoose";

config({ path: ".env.local" });

async function main() {
  const uri = process.env.MONGODB_URI!;
  const dbName = uri.match(/\.net\/([^?]+)/)?.[1];
  console.log("Connecting to database:", dbName);

  await mongoose.connect(uri);
  const admin = mongoose.connection.db!.admin();
  const { databases } = await admin.listDatabases();

  console.log("\nAll databases on this cluster:");
  for (const db of databases) {
    console.log(`  - ${db.name}`);
  }

  const cols = await mongoose.connection.db!.listCollections().toArray();
  console.log(`\nCollections in '${dbName}':`);
  for (const col of cols) {
    const count = await mongoose.connection.db!.collection(col.name).countDocuments();
    console.log(`  - ${col.name}: ${count} documents`);
  }

  await mongoose.disconnect();
}

main().catch(console.error);
