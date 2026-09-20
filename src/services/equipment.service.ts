import { randomUUID } from "node:crypto";

import type {
    CreateEquipmentInput,
    Equipment,
} from "../models/equipment.model.js";
import { equipmentRepository } from "../repositories/equipment.repository.js";
import { AppError } from "../utils/appError.js";
import type { UpdateEquipmentInput } from "../schemas/equipment.schema.js";

export class EquipmentService {
    constructor(
        private readonly repository = equipmentRepository,
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
}

export const equipmentService = new EquipmentService();
