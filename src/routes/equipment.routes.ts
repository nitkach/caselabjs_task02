import { Router } from "express";

import {
    createEquipment,
    getEquipment,
    listEquipment,
} from "../controllers/equipment.controller.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createEquipmentSchema } from "../schemas/equipment.schema.js";

export const equipmentRouter = Router();

equipmentRouter.get("/equipment", listEquipment);

equipmentRouter.post(
    "/equipment",
    validateRequest(createEquipmentSchema),
    createEquipment,
);

equipmentRouter.get("/equipment/:id", getEquipment);
