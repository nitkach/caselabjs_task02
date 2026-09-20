import type { MaintenanceRequest } from "../models/maintenanceRequest.model.js";

export class MaintenanceRequestRepository {
    private readonly requests = new Map<string, MaintenanceRequest>();

    hasOpenByEquipmentId(equipmentId: string): boolean {
        return [...this.requests.values()].some(
            (request) =>
                request.equipmentId === equipmentId &&
                (request.status === "new" || request.status === "in_progress"),
        );
    }
}

export const maintenanceRequestRepository = new MaintenanceRequestRepository();
