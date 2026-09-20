import { Router } from "express";
import {
    listMaintenanceRequest,
    createMaintenanceRequest,
    getMaintenanceRequest,
    patchMaintenanceRequest,
    patchMaintenanceRequestStatus,
    deleteMaintenanceRequest,
} from "../controllers/maintenanceRequest.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
    createMaintenanceRequestSchema,
    updateMaintenanceRequestSchema,
    updateMaintenanceRequestStatusSchema,
} from "../schemas/maintenanceRequest.schema.js";
export const maintenanceRequestRouter = Router();

maintenanceRequestRouter.get("/requests", listMaintenanceRequest);

maintenanceRequestRouter.post(
    "/requests",
    validateRequest(createMaintenanceRequestSchema),
    createMaintenanceRequest,
);

maintenanceRequestRouter.get("/requests/:id", getMaintenanceRequest);

maintenanceRequestRouter.patch(
    "/requests/:id",
    validateRequest(updateMaintenanceRequestSchema),
    patchMaintenanceRequest,
);

maintenanceRequestRouter.patch(
    "/requests/:id/status",
    validateRequest(updateMaintenanceRequestStatusSchema),
    patchMaintenanceRequestStatus,
);

maintenanceRequestRouter.delete(
    "/requests/:id",
    deleteMaintenanceRequest
);
