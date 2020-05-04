console.log("--------------------------------------------");
const express = require("express");
const routes = express.Router();
const bodyParser = require("body-parser");

routes.use(require("cors")());
routes.post("/", async ({ body: { subject, email, body } }, res) => {
  if (!subject || !email || !body) {
    res.status(400).json("Missing fields!");
    return;
  }
  try {
    const transport = require("nodemailer").createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    await transport.sendMail({
      from: process.env.MAIL_FROM,
      sender: process.env.MAIL_SENDER || process.env.MAIL_FROM,
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
express()
  .use(require("morgan")("dev"))
  .use(express.json())
  .use(
    express.static(require("path").join(__dirname, "./dist/public"), {
      maxAge: 31557600000,
    })
  )
  .use(bodyParser.json({ limit: "50mb" }))
  .use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
  .use(process.env.NODE_BASEURL || "/api", routes)
  .listen(process.env.NODE_PORT || 5000, () => {
    console.log(
      `[mail][${process.env.NODE_ENV || "local"}:${
        process.env.NODE_PORT || 5000
      }${process.env.NODE_BASEURL || "/api"}] Mail is alive!`
    );
  });
