import type { Request, Response, RequestHandler } from "express";

import type { CreateEquipmentInput, UpdateEquipmentInput } from "../models/equipment.model.js";
import { equipmentService } from "../services/equipment.service.js";

export function listEquipment(_req: Request, res: Response): void {
    res.json({
        success: true,
        data: equipmentService.findAll(),
    });
};

export function createEquipment(
    req: Request<Record<string, never>, unknown, CreateEquipmentInput>,
    res: Response<unknown>
): void {
    const equipment = equipmentService.create(req.body);

    res.status(201).json({
        success: true,
        data: equipment,
    });
}

export function getEquipment(req: Request<{ id: string }>, res: Response<unknown>): void {
    res.json({
        success: true,
        data: equipmentService.findById(req.params.id),
    });
}

export function patchEquipment(
    req: Request<{ id: string }, unknown, UpdateEquipmentInput>,
    res: Response<unknown>
): void {
    const equipment = equipmentService.update(req.body);

    res.status(201).json({
        success: true,
        data: equipment,
    });
}
