const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const checkoutRoutes = require("./routes/checkout.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// -------- CORS CONFIG --------
const allowedOrigins = [
  "http://localhost:3000",      // local frontend
  process.env.FRONTEND_URL      // vercel frontend
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow tools like Postman or server-to-server calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);
// -------- END CORS --------

// health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    db:
      mongoose.connection.readyState === 1
        ? "connected"
        : "not_connected",
  });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;
