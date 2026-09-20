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
import { AppError } from "../utils/appError.js";

export class MaintenanceRequestService {
    constructor(
        private readonly equipmentRepo: EquipmentRepository = equipmentRepository,
        private readonly maintenanceRequestRepo: MaintenanceRequestRepository = maintenanceRequestRepository,
    ) { }
    findAll(): MaintenanceRequest[] {
        return this.maintenanceRequestRepo.findAll();
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
}

export const maintenanceRequestService = new MaintenanceRequestService();
