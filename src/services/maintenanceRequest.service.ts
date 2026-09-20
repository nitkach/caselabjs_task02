import { randomUUID } from "node:crypto";

import type {
    MaintenanceRequest,
} from "../models/maintenanceRequest.model.js";
import { EquipmentRepository, equipmentRepository } from "../repositories/equipment.repository.js";
import { MaintenanceRequestRepository, maintenanceRequestRepository } from "../repositories/maintenanceRequest.repository.js";
import type { CreateMaintenanceRequestInput } from "../schemas/maintenanceRequest.schema.js";
import { AppError } from "../utils/appError.js";

export class MaintenanceRequestService {
    constructor(
        private readonly equipmentRepo: EquipmentRepository = equipmentRepository,
        private readonly maintenanceRequestRepo: MaintenanceRequestRepository = maintenanceRequestRepository,
    ) { }

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

    findAll(): MaintenanceRequest[] {
        return this.maintenanceRequestRepo.findAll();
    }

    findByEquipmentId(equipmentId: string): MaintenanceRequest[] {
        const equipment = this.equipmentRepo.findById(equipmentId);

        if (!equipment) {
            throw new AppError(404, "Equipment not found");
        }

        return this.maintenanceRequestRepo.findByEquipmentId(equipmentId);
    }
}

export const maintenanceRequestService = new MaintenanceRequestService();
