import type { Request, Response } from "express";

import { maintenanceRequestService } from "../services/maintenanceRequest.service.js";
import type { CreateMaintenanceRequestInput } from "../schemas/maintenanceRequest.schema.js";

export function listMaintenanceRequest(_req: Request, res: Response): void {
    res.json({
        success: true,
        data: maintenanceRequestService.findAll(),
    });
};


export function createMaintenanceRequest(
    req: Request<Record<string, never>, unknown, CreateMaintenanceRequestInput>,
    res: Response<unknown>
): void {
    const equipment = maintenanceRequestService.create(req.body);

    res.status(201).json({
        success: true,
        data: equipment,
    });
}
