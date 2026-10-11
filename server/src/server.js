const dns = require("dns");
// Configure reliable DNS servers to resolve MongoDB Atlas SRV (_mongodb._tcp) records
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const cors = require("cors");
const express = require("express");
const moment = require("moment-timezone");
const morgan = require("morgan");
const mongoose = require("mongoose");
const rootRouter = require("./api/index.js");
const config = require("./config/config.js");
const globalErrorHandler = require("./middleware/errors/globalErrorHandler.js");
const colors = require("colors");
require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

moment.tz.setDefault("Asia/Dhaka");
const currentDate = moment();

const FALLBACK_PLACEHOLDER_URL =
  "https://res.cloudinary.com/wpttnkjq/image/upload/v1786514995/placeholder_vnae7z.svg";

app.use(`/api/v1${config.uploadPath}`, express.static(config.uploadFolder));
app.use(`/api/v1${config.uploadPath}`, (req, res) => {
  res.redirect(302, FALLBACK_PLACEHOLDER_URL);
});

if (config.uploadPath) {
  app.use(config.uploadPath, express.static(config.uploadFolder));
  app.use(config.uploadPath, (req, res) => {
    res.redirect(302, FALLBACK_PLACEHOLDER_URL);
  });
}

app.use("/api/v1", rootRouter);

app.get("/api", (req, res, next) => {
  res.send("welcome to okobiz");
});

app.get("/time", (req, res, next) => {
  res.send(currentDate.format("YYYY-MM-DD HH:mm:ss"));
});

app.use(globalErrorHandler);

mongoose
  .connect(config.databaseUrl)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection error:", err.message);
    console.error("Full error details:", err);
  });

app.listen(config.port, () => {
  console.log(`app listening to port `, config.port);
}); // Reload: 2026-10-06T18:19:20
// app.listen(config.port, '192.168.0.117', () => {
//   console.log(`App listening at http://192.168.0.117:${config.port}`);
// });
// app.listen(config.port, '192.168.0.106', () => {
//   console.log(`App listening at http://192.168.0.106:${config.port}`);
// });
