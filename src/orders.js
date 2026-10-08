const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createOrder(req, res) {
  const {
    order_id,
    scenario = "normal",
    customer_email,
    payment_token
  } = req.body;

  // Instrumentación inicial deliberadamente deficiente.
  // Durante la actividad se modificará únicamente este archivo.

  req.log.info(
    {
      body: {
        order_id,
        scenario,
        customer_email,
        payment_token
      }
    },
    "Order received"
  );

  await delay(20);

  req.log.info("Calling payment");

  if (scenario === "payment-timeout") {
    await delay(60);
    req.log.error("Payment failed");

    return res.status(504).json({
      error: "payment_timeout",
      order_id
    });
  }

  await delay(30);
  req.log.info("Done");

  return res.status(201).json({
    order_id,
    status: "created"
  });
}
