import { readFileSync, existsSync } from "node:fs";

const file = "evidencia.txt";

if (!existsSync(file)) {
  console.error(`No existe ${file}. Ejecute primero: npm run evidence`);
  process.exit(1);
}

const lines = readFileSync(file, "utf8")
  .split(/\r?\n/)
  .filter((line) => line.length > 0);

console.log(lines.slice(-12).join("\n"));
