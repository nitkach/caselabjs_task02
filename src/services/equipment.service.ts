import { randomUUID } from "node:crypto";

import type {
    CreateEquipmentInput,
    Equipment,
} from "../models/equipment.model.js";
import { equipmentRepository } from "../repositories/equipment.repository.js";
import { AppError } from "../utils/appError.js";

export class EquipmentService {
    constructor(
        private readonly repository = equipmentRepository,
    ) {}

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
}

export const equipmentService = new EquipmentService();
