import fs from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..", "..");
const requiredFiles = [
  "frontend/package.json",
  "backend/package.json",
  "backend/prisma/schema.prisma",
  "docker-compose.yml",
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length > 0) {
  console.error(`Missing required files:\n${missing.map((file) => `- ${file}`).join("\n")}`);
  process.exit(1);
}

console.log("Environment structure check passed.");
