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

routes.use(cors());

routes.post("/email", async (req, res) => {
  try {
    const { subject, email, body } = req.body;
    const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "5a3d1484c25f0b",
        pass: "cdf5ee833269e7",
      },
    });
    const message = {
      from: "no-replay@ictg.com",
      sender: "no-replay@ictg.com",
      to: email,
      subject,
      html: body,
    };
    await transport.sendMail(message);
    res.status(200).json({ message: "Sended!" });
  } catch (e) {
    res.status(500).json(e);
  }
});

//Routes
app.use("/api", routes);

//Static Files
app.use(
  express.static(path.join(__dirname, "./dist/public"), { maxAge: 31557600000 })
);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `[mail][${process.env.NODE_ENV}] Mail is running on PORT ${PORT}`
  );
});
