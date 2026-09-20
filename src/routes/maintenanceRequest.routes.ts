import { Router } from "express";
import { listMaintenanceRequest, createMaintenanceRequest } from "../controllers/maintenanceRequest.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createMaintenanceRequestSchema } from "../schemas/maintenanceRequest.schema.js";
export const maintenanceRequestRouter = Router();

maintenanceRequestRouter.get("/requests", listMaintenanceRequest);

maintenanceRequestRouter.post(
    "/requests",
    validateRequest(createMaintenanceRequestSchema),
    createMaintenanceRequest,
);
