require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const apiRoutes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

/* =========================
   DATABASE
========================= */
connectDB();

/* =========================
   TRUST PROXY
========================= */
app.set("trust proxy", 1);

/* =========================
   SECURITY
========================= */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* =========================
   CORS
========================= */
app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "*",
    credentials: true,
  })
);

/* =========================
   PERFORMANCE
========================= */
app.use(compression());

/* =========================
   RATE LIMIT
========================= */
const limiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,
    max:
      process.env.NODE_ENV ===
      "production"
        ? 250
        : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message:
        "Too many requests. Try again later.",
    },
  });

app.use(limiter);

/* =========================
   BODY PARSERS
========================= */
app.use(
  express.json({
    limit: "5mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "5mb",
  })
);

/* =========================
   ROOT
========================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "Ughelli Job Connect API",
    status: "running",
    env:
      process.env.NODE_ENV,
  });
});

/* =========================
   API
========================= */
app.use(
  "/api/v1",
  apiRoutes
);

/* =========================
   404
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      "Route not found.",
  });
});

/* =========================
   ERROR HANDLER
========================= */
app.use(errorHandler);

/* =========================
   START SERVER
========================= */
const PORT =
  process.env.PORT ||
  5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
  console.log(
    `🌍 Mode: ${process.env.NODE_ENV}`
  );
});
