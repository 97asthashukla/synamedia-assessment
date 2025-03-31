import express from "express";
import dotenv from "dotenv";
import router from "./src/routes/index.routes.js";
import swaggerDocs from "./src/config/swagger.config.js";

dotenv.config();

const app = express();

// Connect Database and Start Server
const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
})

// Middleware
app.use(express.json());

app.use("/api/v1", router);
swaggerDocs(app);


// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`There was an uncaught error: ${err}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, p) => {
  console.warn(`Unhandled Rejection at: ${p}, reason: ${reason}`);
});

export default app;
