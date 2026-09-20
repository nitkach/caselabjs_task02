import { Router } from "express";

import {
    createEquipment,
    getEquipment,
    listEquipment,
    patchEquipment,
    deleteEquipment,
    getMaintenanceRequests,
} from "../controllers/equipment.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
    createEquipmentSchema,
    updateEquipmentSchema,
} from "../schemas/equipment.schema.js";

export const equipmentRouter = Router();

equipmentRouter.get("/equipment", listEquipment);

equipmentRouter.post(
    "/equipment",
    validateRequest(createEquipmentSchema),
    createEquipment,
);

equipmentRouter.get("/equipment/:id", getEquipment);

equipmentRouter.patch(
    "/equipment/:id",
    validateRequest(updateEquipmentSchema),
    patchEquipment,
);

equipmentRouter.delete(
    "/equipment/:id",
    deleteEquipment
);

equipmentRouter.get(
    "/equipment/:id/requests",
    getMaintenanceRequests
);
