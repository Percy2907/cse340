// =======================================
//           IMPORTS
// =======================================
const express = require("express");
const app = express();
const path = require("path");

// Utilities
const utilities = require("./utilities");

// Controllers
const baseController = require("./controllers/baseController");

// Routes
const inventoryRoute = require("./routes/inventoryRoute");
const errorRoute = require("./routes/errorRoute");
const staticRoute = require("./routes/static");

// =======================================
//         EXPRESS CONFIGURATION
// =======================================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(staticRoute);

// =======================================
//           ROUTES
// =======================================

// Home page
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute);

// Error trigger route
app.use("/error", errorRoute);

// =======================================
//           ERROR HANDLING
// =======================================

// Catch-all 404 for unknown routes
app.use((req, res) => {
  res.status(404).render("errors/error", {
    title: "Page Not Found",
    message: "Sorry, the page you requested does not exist.",
  });
});

// Global error handler (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render("errors/error", {
    title: "Server Error",
    message: err.message,
  });
});

// =======================================
//           SERVER
// =======================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});