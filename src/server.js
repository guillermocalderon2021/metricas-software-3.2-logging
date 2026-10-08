import express from "express";
import pino from "pino";
import pinoHttp from "pino-http";
import { randomUUID } from "node:crypto";
import { createOrder } from "./orders.js";

const PORT = Number(process.env.PORT ?? 3000);

const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: null
});

const app = express();

app.use(express.json());

app.use(
  pinoHttp({
    logger,
    autoLogging: false,
    quietReqLogger: true,
    customAttributeKeys: {
      reqId: "request_id"
    },
    genReqId(req, res) {
      const incoming = req.headers["x-request-id"];
      const requestId =
        typeof incoming === "string" && incoming.length > 0
          ? incoming
          : randomUUID();

      res.setHeader("x-request-id", requestId);
      return requestId;
    }
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/orders", createOrder);

app.use((err, req, res, _next) => {
  req.log.error(
    {
      event: "unhandled_error",
      error_type: err?.name ?? "Error"
    },
    "Unhandled application error"
  );

  res.status(500).json({ error: "internal_error" });
});

app.listen(PORT, "127.0.0.1", () => {
  logger.info(
    {
      event: "service_started",
      port: PORT
    },
    "orders-api started"
  );
});
