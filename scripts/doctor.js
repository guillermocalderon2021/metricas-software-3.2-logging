import { execFileSync } from "node:child_process";
import { mkdirSync, accessSync, constants } from "node:fs";

const checks = [];

function check(name, fn) {
  try {
    const detail = fn();
    checks.push({ name, ok: true, detail: detail ?? "" });
  } catch (error) {
    checks.push({
      name,
      ok: false,
      detail: error?.message ?? String(error)
    });
  }
}

check("Node.js >= 22", () => {
  const major = Number(process.versions.node.split(".")[0]);
  if (major < 22) {
    throw new Error(`versión detectada: ${process.versions.node}`);
  }
  return process.versions.node;
});

check("Dependencia express", async () => {
  await import("express");
  return "instalada";
});

check("Dependencia pino", async () => {
  await import("pino");
  return "instalada";
});

check("Dependencia pino-http", async () => {
  await import("pino-http");
  return "instalada";
});

check("jq", () => {
  const output = execFileSync("jq", ["--version"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  }).trim();
  return output;
});

check("src/orders.js", () => {
  accessSync("src/orders.js", constants.R_OK | constants.W_OK);
  return "accesible";
});

check("Directorio logs", () => {
  mkdirSync("logs", { recursive: true });
  accessSync("logs", constants.R_OK | constants.W_OK);
  return "accesible";
});

const resolved = [];
for (const c of checks) {
  if (c.detail instanceof Promise) {
    try {
      const detail = await c.detail;
      resolved.push({ ...c, detail, ok: true });
    } catch (error) {
      resolved.push({
        ...c,
        ok: false,
        detail: error?.message ?? String(error)
      });
    }
  } else {
    resolved.push(c);
  }
}

console.log("\nVerificación del entorno\n");

for (const item of resolved) {
  console.log(
    `${item.ok ? "OK  " : "FAIL"} ${item.name}` +
      (item.detail ? `: ${item.detail}` : "")
  );
}

const failures = resolved.filter((item) => !item.ok);

if (failures.length > 0) {
  console.log(
    "\nCorrija únicamente los elementos marcados como FAIL antes de continuar."
  );
  process.exit(1);
}

console.log("\nEntorno listo para la actividad.");
