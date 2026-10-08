import { spawn } from "node:child_process";
import {
  createWriteStream,
  mkdirSync,
  rmSync
} from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const LOG_FILE = "logs/app.jsonl";

const cases = [
  {
    requestId: "req-a41",
    body: {
      order_id: "ord-1001",
      scenario: "normal",
      customer_email: "ana@example.test",
      payment_token: "tok_demo_1001"
    }
  },
  {
    requestId: "req-b92",
    body: {
      order_id: "ord-1002",
      scenario: "payment-timeout",
      customer_email: "bruno@example.test",
      payment_token: "tok_demo_1002"
    }
  },
  {
    requestId: "req-c17",
    body: {
      order_id: "ord-1003",
      scenario: "normal",
      customer_email: "carla@example.test",
      payment_token: "tok_demo_1003"
    }
  },
  {
    requestId: "req-d64",
    body: {
      order_id: "ord-1004",
      scenario: "payment-timeout",
      customer_email: "diego@example.test",
      payment_token: "tok_demo_1004"
    }
  }
];

mkdirSync("logs", { recursive: true });
rmSync(LOG_FILE, { force: true });

const logStream = createWriteStream(LOG_FILE, { flags: "a" });

const server = spawn(process.execPath, ["src/server.js"], {
  env: {
    ...process.env,
    PORT: String(PORT),
    LOG_LEVEL: "info"
  },
  stdio: ["ignore", "pipe", "pipe"]
});

server.stdout.pipe(logStream);

server.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
});

async function waitForHealth() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      if (response.ok) return;
    } catch {
      // El servidor todavía no está listo.
    }
    await sleep(100);
  }

  throw new Error("orders-api no respondió en /health.");
}

async function sendCase(item) {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-request-id": item.requestId
    },
    body: JSON.stringify(item.body)
  });

  return {
    request_id: item.requestId,
    order_id: item.body.order_id,
    scenario: item.body.scenario,
    status: response.status
  };
}

let exitCode = 0;

try {
  await waitForHealth();

  const results = await Promise.all(cases.map(sendCase));

  console.log("\nEscenario ejecutado\n");
  console.table(results);

  console.log(`Logs escritos en ${LOG_FILE}`);
} catch (error) {
  exitCode = 1;
  console.error(`ERROR: ${error.message}`);
} finally {
  server.kill("SIGTERM");
  await sleep(150);
  logStream.end();
}

process.exitCode = exitCode;
