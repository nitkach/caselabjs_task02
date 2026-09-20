import type { MaintenanceRequest } from "../models/maintenanceRequest.model.js";
import type { EquipmentService } from "../services/equipment.service.js";

export class MaintenanceRequestRepository {
    private readonly equipment = new Map<string, MaintenanceRequest>();
}

export const maintenanceRequestRepository = new MaintenanceRequestRepository();
