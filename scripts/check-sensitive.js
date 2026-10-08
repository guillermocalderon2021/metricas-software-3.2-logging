import { readFileSync, existsSync } from "node:fs";

const file = "logs/app.jsonl";

if (!existsSync(file)) {
  console.error(`No existe ${file}. Ejecute primero: npm run exercise`);
  process.exit(1);
}

const content = readFileSync(file, "utf8");

const patterns = [
  { label: "customer_email", regex: /customer_email/i },
  { label: "payment_token", regex: /payment_token/i },
  { label: "email de prueba", regex: /@example\.test/i },
  { label: "token de prueba", regex: /tok_demo_/i }
];

const found = patterns.filter((item) => item.regex.test(content));

if (found.length === 0) {
  console.log("OK: no se detectó información sensible de la práctica.");
  process.exit(0);
}

console.log("FAIL: se detectó información que no debe persistirse:");
for (const item of found) {
  console.log(`- ${item.label}`);
}
process.exit(2);
