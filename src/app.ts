/* eslint-disable */

import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import { globalErrorHandler } from "@/controllers/error-controller";
import mongoSanitize from "mongo-sanitize";
import formRouter from "@/routes/form-routes";

const app = express();

// http headers security
app.use(helmet());

// body parsing
app.use(express.json({ limit: "10kb" }));

// parameter pollution to remove duplicate query params
app.use(
  hpp({
    whitelist: ["rent"],
  })
);

// setting cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// logger in dev mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// limiting request from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 30 * 60 * 1000,
  message: "Too many requests.",
});
app.use(limiter);

// sanitizing against sql query injection
app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      req.body[key] = mongoSanitize(req.body[key]);
    }
  }

  if (req.params) {
    for (const key in req.params) {
      req.params[key] = mongoSanitize(req.params[key]);
    }
  }

  if (req.query) {
    for (const key in req.query) {
      req.query[key] = mongoSanitize(req.query[key]);
    }
  }

  next();
});

// rotes
app.use("/api/v1/forms", formRouter);

// Handle unknown routes (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Cannot find ${req.originalUrl} on this server.`,
  });
});

//handling errors globally
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  globalErrorHandler(err, req, res);
});

export default app;
