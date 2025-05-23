import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://bazarly-client.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Bazarly Server is running",
  });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({
    success: false,
    message: "API not found",
    error: {
      path: req.originalUrl,
      message: "Your requested API is not available",
    },
  });
});

export default app;
