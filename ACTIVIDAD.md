# Actividad individual — Clase 3.2

**Tiempo de trabajo:** 20 minutos.  
**Tiempo de verificación y entrega:** 10 minutos.

Modifique únicamente `src/orders.js`.

## Objetivo

Los logs deben permitir reconstruir una solicitud concreta entre varias solicitudes concurrentes.

## Requisitos

La instrumentación debe producir los eventos:

- `order_received`
- `payment_started`
- `payment_timeout`
- `order_completed`

Debe conservar, cuando corresponda:

- `order_id`
- `dependency`
- `timeout_ms`

`request_id` ya es incorporado por la infraestructura del servicio.

No registre `customer_email` ni `payment_token`.

## Procedimiento

1. Verifique el entorno:

   ```bash
   npm run doctor
   ```

2. Modifique `src/orders.js`.

3. Ejecute:

   ```bash
   npm run exercise
   ```

4. Compruebe que exista `logs/app.jsonl`. Puede visualizar una muestra con:

   ```text
   npm run logs:sample
   ```

5. Investigue `req-b92` con `jq`.

6. Compruebe los timeouts.

7. Verifique que no aparezcan datos sensibles:

   ```text
   npm run check:sensitive
   ```

8. Genere la evidencia:

   ```bash
   npm run evidence
   ```

9. Revise:

   ```text
   npm run evidence:show
   ```

10. Suba `evidencia.txt` cuando el archivo indique:

   ```text
   RESULTADO: EVIDENCIA COMPLETA
   ```

## Escenario

| request_id | order_id | resultado esperado |
|---|---|---|
| req-a41 | ord-1001 | normal |
| req-b92 | ord-1002 | payment-timeout |
| req-c17 | ord-1003 | normal |
| req-d64 | ord-1004 | payment-timeout |

## Consultas que debe poder responder

- ¿Qué ocurrió con `req-b92`?
- ¿Qué orden corresponde a esa solicitud?
- ¿Qué solicitudes terminaron con `payment_timeout`?
- ¿Qué evento precedió al timeout?
- ¿Se persistió información sensible?
