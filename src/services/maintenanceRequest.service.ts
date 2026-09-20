import { randomUUID } from "node:crypto";

import type {
    MaintenanceRequest,
} from "../models/maintenanceRequest.model.js";
import { EquipmentRepository, equipmentRepository } from "../repositories/equipment.repository.js";
import { MaintenanceRequestRepository, maintenanceRequestRepository } from "../repositories/maintenanceRequest.repository.js";
import type {
    CreateMaintenanceRequestInput,
    UpdateMaintenanceRequestInput,
    UpdateMaintenanceRequestStatusInput,
} from "../schemas/maintenanceRequest.schema.js";
import type { MaintenanceRequestListQuery } from "../schemas/list.schema.js";
import { AppError } from "../utils/appError.js";

export class MaintenanceRequestService {
    constructor(
        private readonly equipmentRepo: EquipmentRepository = equipmentRepository,
        private readonly maintenanceRequestRepo: MaintenanceRequestRepository = maintenanceRequestRepository,
    ) { }
    findAll(query?: MaintenanceRequestListQuery): {
        data: MaintenanceRequest[];
        meta: { total: number; page: number; limit: number };
    } {
        const options = query ?? {
            page: 1,
            limit: 20,
            sortBy: "createdAt" as const,
            sortOrder: "asc" as const,
        };
        let items = this.maintenanceRequestRepo.findAll();

        if (options.status) items = items.filter((item) => item.status === options.status);
        if (options.priority) items = items.filter((item) => item.priority === options.priority);
        if (options.equipmentId) items = items.filter((item) => item.equipmentId === options.equipmentId);
        if (options.createdFrom) items = items.filter((item) => item.createdAt >= options.createdFrom!);
        if (options.createdTo) items = items.filter((item) => item.createdAt <= options.createdTo!);
        if (options.plannedFrom) items = items.filter((item) => item.plannedAt !== undefined && item.plannedAt >= options.plannedFrom!);
        if (options.plannedTo) items = items.filter((item) => item.plannedAt !== undefined && item.plannedAt <= options.plannedTo!);

        const direction = options.sortOrder === "asc" ? 1 : -1;
        items.sort((left, right) => {
            const leftValue = left[options.sortBy] ?? "";
            const rightValue = right[options.sortBy] ?? "";
            return String(leftValue).localeCompare(String(rightValue)) * direction;
        });

        const total = items.length;
        const start = (options.page - 1) * options.limit;

        return {
            data: items.slice(start, start + options.limit),
            meta: { total, page: options.page, limit: options.limit },
        };
    }

    findById(id: string): MaintenanceRequest {
        const maintenanceRequest = this.maintenanceRequestRepo.findById(id);

        if (!maintenanceRequest) {
            throw new AppError(404, "Maintenance request not found");
        }

        return maintenanceRequest;
    }


    create(input: CreateMaintenanceRequestInput): MaintenanceRequest {
        const equipment = this.equipmentRepo.findById(input.equipmentId);

        if (!equipment) {
            throw new AppError(404, "Equipment not found");
        }

        const now = new Date().toISOString();

        return this.maintenanceRequestRepo.create({
            id: randomUUID(),
            equipmentId: equipment.id,
            title: input.title,
            ...(input.description === undefined
                ? {}
                : { description: input.description }),
            priority: input.priority,
            status: "new",
            ...(input.plannedAt === undefined
                ? {}
                : { plannedAt: input.plannedAt }),
            createdAt: now,
            updatedAt: now,
        });
    }

    findByEquipmentId(equipmentId: string): MaintenanceRequest[] {
        const equipment = this.equipmentRepo.findById(equipmentId);

        if (!equipment) {
            throw new AppError(404, "Equipment not found");
        }

        return this.maintenanceRequestRepo.findByEquipmentId(equipmentId);
    }

    update(id: string, input: UpdateMaintenanceRequestInput): MaintenanceRequest {
        this.findById(id);
        const updated = this.maintenanceRequestRepo.update(id, {
            ...input,
            updatedAt: new Date().toISOString(),
        });

        if (!updated) {
            throw new AppError(404, "Maintenance request not found");
        }

        return updated;
    }

    updateStatus(
        id: string,
        input: UpdateMaintenanceRequestStatusInput,
    ): MaintenanceRequest {
        const current = this.findById(id);
        const allowedTransitions: Record<
            MaintenanceRequest["status"],
            MaintenanceRequest["status"][]
        > = {
            new: ["in_progress", "rejected"],
            in_progress: ["done", "rejected"],
            done: [],
            rejected: [],
        };

        if (!allowedTransitions[current.status].includes(input.status)) {
            throw new AppError(409, "Invalid maintenance request status transition");
        }

        const updated = this.maintenanceRequestRepo.update(id, {
            status: input.status,
            updatedAt: new Date().toISOString(),
        });

        if (!updated) {
            throw new AppError(404, "Maintenance request not found");
        }

        return updated;
    }

    delete(id: string): MaintenanceRequest {
        this.findById(id);
        const deletedRequest = this.maintenanceRequestRepo.delete(id);

        if (!deletedRequest) {
            throw new AppError(404, "Maintenance request not found");
        }

        return deletedRequest;
    }
}

export const maintenanceRequestService = new MaintenanceRequestService();
