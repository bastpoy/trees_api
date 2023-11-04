"use strict";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: "api",
    pass: process.env.TOKEN_MAILTRAP,
  },
});

exports.sendMail = async (req, res) => {
  try {
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("IP address:", ip);
    const info = await transporter.sendMail({
      from: "email@bastpoy.fr", // sender address
      to: "bastien.poyet@outlook.fr", // list of receivers
      subject: "Information de connexion", // Subject line
      html: `<p>Connexion avec le mail <strong>${req.params.email}</strong>?</p>
      <p>L'ip de la personne est ${ip}</p>`,
    });
    console.log("le req body vaut" + req.params.email);
    res.status(200).redirect("/user");
  } catch (err) {
    console.log(err);
  }
};
