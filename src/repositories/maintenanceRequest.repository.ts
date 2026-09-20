import type { MaintenanceRequest } from "../models/maintenanceRequest.model.js";

export class MaintenanceRequestRepository {
    private readonly maintenanceRequests = new Map<string, MaintenanceRequest>();

    hasOpenByEquipmentId(equipmentId: string): boolean {
        return [...this.maintenanceRequests.values()].some(
            (request) =>
                request.equipmentId === equipmentId &&
                (request.status === "new" || request.status === "in_progress"),
        );
    }

    findByEquipmentId(equipmentId: string): MaintenanceRequest[] {
        return [...this.maintenanceRequests.values()].filter(request => request.equipmentId === equipmentId)
    }
}

export const maintenanceRequestRepository = new MaintenanceRequestRepository();
