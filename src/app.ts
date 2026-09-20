import express from "express";

import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { equipmentRouter } from "./routes/equipment.routes.js";
import { usersRouter } from "./routes/users.js";

export const app = express();

app.use(express.json());
app.use(requestLogger);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    status: "ok",
  });
});

app.use("/api", usersRouter);
app.use("/api", equipmentRouter);

app.use(notFoundHandler);
app.use(errorHandler);
