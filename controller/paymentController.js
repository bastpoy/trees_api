// This is your test secret API key.
const stripe = require("stripe")(process.env.PUBLIC_KEY_STRIPE);

const YOUR_DOMAIN = "http://localhost:8000";

exports.createPayment = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: "price_1O6An0J6nYux5k9WYU6qkbLu",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}`,
      cancel_url: `${YOUR_DOMAIN}`,
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.log(error);
  }
};
