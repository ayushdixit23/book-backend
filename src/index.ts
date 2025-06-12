import express from "express";
import { NODE_ENV, PORT } from "./utils/envConfig.js";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { errorMiddleware } from "./middlewares/errors/errorMiddleware.js";
import { CustomError } from "./middlewares/errors/CustomError.js";
import { rateLimit } from "express-rate-limit";
import bookRouter from "./routes/books.js"

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 400,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://book-management.ayushdixit.site",
];

// Initialize Express app
const app = express();

// Middlewares
app.use(helmet()); // Security headers
app.use(limiter); // Rate limiting middleware

// Logging based on environment (development/production)
const logFormat = NODE_ENV === "development" ? "dev" : "combined";
app.use(morgan(logFormat));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies to be sent
  })
);


app.use("/api", bookRouter)

// Routes
app.get("/", (_, res) => {
  res.send("Server is running!");
});

app.get("/api/error", (_, res) => {
  throw new CustomError("This is a custom error", 400);
});

// 404 Handler for non-existent routes (must come after routes)
app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handling Middleware (must come after routes and 404 handler)
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
