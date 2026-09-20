import type { MaintenanceRequest } from "../models/maintenanceRequest.model.js";

export class MaintenanceRequestRepository {
    private readonly maintenanceRequests = new Map<string, MaintenanceRequest>();

    findAll(): MaintenanceRequest[] {
        return [...this.maintenanceRequests.values()];
    }

    findById(id: string): MaintenanceRequest | undefined {
        return this.maintenanceRequests.get(id);
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

    update(
        id: string,
        changes: Partial<MaintenanceRequest>,
    ): MaintenanceRequest | undefined {
        const current = this.maintenanceRequests.get(id);

        if (!current) {
            return undefined;
        }

        const updated = {
            ...current,
            ...changes,
            id: current.id,
            createdAt: current.createdAt,
        };

        this.maintenanceRequests.set(id, updated);
        return updated;
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
