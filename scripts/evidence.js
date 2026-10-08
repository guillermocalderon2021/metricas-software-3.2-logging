import {
  readFileSync,
  writeFileSync,
  existsSync
} from "node:fs";

const LOG_FILE = "logs/app.jsonl";
const OUTPUT_FILE = "evidencia.txt";

if (!existsSync(LOG_FILE)) {
  console.error(
    `No existe ${LOG_FILE}. Ejecute primero: npm run exercise`
  );
  process.exit(1);
}

const rawLines = readFileSync(LOG_FILE, "utf8")
  .split(/\r?\n/)
  .filter((line) => line.trim().length > 0);

const records = [];

for (const line of rawLines) {
  try {
    records.push(JSON.parse(line));
  } catch {
    // Una línea no JSON no forma parte de la evidencia estructurada.
  }
}

function requestIdOf(record) {
  return record.request_id ?? record.reqId ?? null;
}

const targetRequest = records.filter(
  (record) => requestIdOf(record) === "req-b92"
);

const timeouts = records.filter(
  (record) => record.event === "payment_timeout"
);

const eventCounts = new Map();

for (const record of records) {
  if (typeof record.event === "string") {
    eventCounts.set(
      record.event,
      (eventCounts.get(record.event) ?? 0) + 1
    );
  }
}

const targetEvents = targetRequest.filter(
  (record) => typeof record.event === "string"
);

const validations = [
  {
    label: "request_id presente",
    ok:
      targetEvents.length > 0 &&
      targetEvents.every((record) => requestIdOf(record) === "req-b92")
  },
  {
    label: "order_id presente para req-b92",
    ok: targetEvents.some((record) => record.order_id === "ord-1002")
  },
  {
    label: "event estructurado",
    ok: targetEvents.some((record) => typeof record.event === "string")
  },
  {
    label: "payment_timeout consultable",
    ok: timeouts.length === 2
  },
  {
    label: "dependency presente en payment_timeout",
    ok:
      timeouts.length > 0 &&
      timeouts.every(
        (record) => record.dependency === "payment-service"
      )
  },
  {
    label: "timeout_ms presente",
    ok:
      timeouts.length > 0 &&
      timeouts.every(
        (record) => Number.isFinite(record.timeout_ms)
      )
  },
  {
    label: "sin customer_email en logs",
    ok: !records.some(
      (record) =>
        JSON.stringify(record).includes("@example.test")
    )
  },
  {
    label: "sin payment_token en logs",
    ok: !records.some(
      (record) =>
        JSON.stringify(record).includes("tok_demo_")
    )
  }
];

const lines = [];

lines.push("MÉTRICAS DE SOFTWARE");
lines.push("Clase 3.2 - Logging estructurado");
lines.push("");

lines.push("=== Solicitud req-b92 ===");
if (targetRequest.length === 0) {
  lines.push("(sin registros)");
} else {
  for (const record of targetRequest) {
    lines.push(JSON.stringify(record));
  }
}

lines.push("");
lines.push("=== Eventos payment_timeout ===");
if (timeouts.length === 0) {
  lines.push("(sin registros)");
} else {
  for (const record of timeouts) {
    lines.push(JSON.stringify(record));
  }
}

lines.push("");
lines.push("=== Resumen de eventos ===");
if (eventCounts.size === 0) {
  lines.push("(no se encontraron campos event)");
} else {
  for (const [event, count] of [...eventCounts.entries()].sort()) {
    lines.push(`${event}: ${count}`);
  }
}

lines.push("");
lines.push("=== Validación ===");
for (const item of validations) {
  lines.push(`${item.ok ? "OK" : "FAIL"} ${item.label}`);
}

const allOk = validations.every((item) => item.ok);

lines.push("");
lines.push(
  `RESULTADO: ${allOk ? "EVIDENCIA COMPLETA" : "REVISAR INSTRUMENTACIÓN"}`
);

writeFileSync(OUTPUT_FILE, `${lines.join("\n")}\n`, "utf8");

console.log(`Generado ${OUTPUT_FILE}`);

if (!allOk) {
  console.log(
    "Hay validaciones FAIL. Revise la instrumentación y repita npm run exercise."
  );
  process.exitCode = 2;
}
