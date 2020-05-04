console.log("--------------------------------------------");
const morgan = require("morgan");
const express = require("express");
const path = require("path");
var cors = require("cors");
const routes = require("express").Router();
const nodemailer = require("nodemailer");
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.static(path.join(__dirname, "./dist/public"), { maxAge: 31557600000 })
);
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
routes.use(cors());
routes.post("/email", async ({ subject, email, body }, res) => {
  await (async (time) =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, time * 1000)
    ))(1.2);
  res.status(200).json("Mail Sended!");
  return;

  if (!subject || !email || !body) {
    res.status(400).json("Missing fields!");
    return;
  }
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "5a3d1484c25f0b",
        pass: "cdf5ee833269e7",
      },
    });
    await transport.sendMail({
      from: "no-replay@ictg.com",
      sender: "no-replay@ictg.com",
      to: email,
      subject,
      html: body,
    });
    res.status(200).json({ message: "Sended!" });
  } catch (e) {
    console.log("e", e);
    res.status(500).json(e);
  }
});
app.use("/api", routes);
app.listen(5000, () => {
  console.log(`[mail][${process.env.NODE_ENV}] Mail is running on PORT 5000`);
});
