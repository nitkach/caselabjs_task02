import { randomUUID } from "node:crypto";

import type {
    CreateEquipmentInput,
    Equipment,
} from "../models/equipment.model.js";
import { EquipmentRepository, equipmentRepository } from "../repositories/equipment.repository.js";
import { MaintenanceRequestRepository, maintenanceRequestRepository } from "../repositories/maintenanceRequest.repository.js";
import { AppError } from "../utils/appError.js";
import type { UpdateEquipmentInput } from "../schemas/equipment.schema.js";

export class EquipmentService {
    constructor(
        private readonly repository: EquipmentRepository = equipmentRepository,
        private readonly maintenanceRequestRepository: MaintenanceRequestRepository = maintenanceRequestRepository,
    ) { }

    findAll(): Equipment[] {
        return this.repository.findAll();
    }

    findById(id: string): Equipment {
        const equipment = this.repository.findById(id);

        if (!equipment) {
            throw new AppError(404, "Equipment not found");
        }

        return equipment;
    }

    create(input: CreateEquipmentInput): Equipment {
        if (this.repository.findBySerialNumber(input.serialNumber)) {
            throw new AppError(409, "Serial number is already in use");
        }

        return this.repository.create({
            id: randomUUID(),
            ...input,
        });
    }

    update(id: string, input: UpdateEquipmentInput): Equipment {
        const current = this.findById(id);

        if (
            input.serialNumber !== undefined &&
            input.serialNumber !== current.serialNumber
        ) {
            const duplicate = this.repository.findBySerialNumber(input.serialNumber);

            if (duplicate && duplicate.id !== id) {
                throw new AppError(409, "Serial number is already in use");
            }
        }

        const updated = this.repository.update(id, input);

        if (!updated) {
            throw new AppError(404, "Equipment not found");
        }

        return updated;
    }

    delete(id: string): Equipment {
        const equipment = this.findById(id);
        const hasOpenMaintenanceRequest =
            this.maintenanceRequestRepository.hasOpenByEquipmentId(id);

        if (hasOpenMaintenanceRequest) {
            throw new AppError(409, "Equipment has open maintenance requests");
        }

        this.repository.delete(id);

        return equipment;
    }
}

export const equipmentService = new EquipmentService();
