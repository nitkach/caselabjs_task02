import type { MaintenanceRequest } from "../models/maintenanceRequest.model.js";

export class MaintenanceRequestRepository {
    private readonly maintenanceRequests = new Map<string, MaintenanceRequest>();

    findAll(): MaintenanceRequest[] {
        return [...this.maintenanceRequests.values()];
    }

    findByEquipmentId(equipmentId: string): MaintenanceRequest[] {
        return [...this.maintenanceRequests.values()].filter(
            (request) => request.equipmentId === equipmentId,
        );
    }

    create(request: MaintenanceRequest): MaintenanceRequest {
        this.maintenanceRequests.set(request.id, request);
        return request;
    }

    hasOpenByEquipmentId(equipmentId: string): boolean {
        return [...this.maintenanceRequests.values()].some(
            (request) =>
                request.equipmentId === equipmentId &&
                (request.status === "new" || request.status === "in_progress"),
        );
    }
}

export const maintenanceRequestRepository = new MaintenanceRequestRepository();
