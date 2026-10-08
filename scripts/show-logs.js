import { readFileSync, existsSync } from "node:fs";

const file = "logs/app.jsonl";

if (!existsSync(file)) {
  console.error(`No existe ${file}. Ejecute primero: npm run exercise`);
  process.exit(1);
}

const lines = readFileSync(file, "utf8")
  .split(/\r?\n/)
  .filter((line) => line.trim().length > 0)
  .slice(0, 10);

for (const line of lines) {
  try {
    console.log(JSON.stringify(JSON.parse(line), null, 2));
  } catch {
    console.log(line);
  }
}
