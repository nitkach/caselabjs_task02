import { randomUUID } from "node:crypto";

import type {
    CreateEquipmentInput,
    Equipment,
} from "../models/equipment.model.js";
import { EquipmentRepository, equipmentRepository } from "../repositories/equipment.repository.js";
import { MaintenanceRequestRepository, maintenanceRequestRepository } from "../repositories/maintenanceRequest.repository.js";
import { AppError } from "../utils/appError.js";
import type { UpdateEquipmentInput } from "../schemas/equipment.schema.js";
import type { EquipmentListQuery } from "../schemas/list.schema.js";

export class EquipmentService {
    constructor(
        private readonly equipmentRepo: EquipmentRepository = equipmentRepository,
        private readonly maintenanceRequestRepo: MaintenanceRequestRepository = maintenanceRequestRepository,
    ) { }

    findAll(query?: EquipmentListQuery): {
        data: Equipment[];
        meta: { total: number; page: number; limit: number };
    } {
        const options = query ?? {
            page: 1,
            limit: 20,
            sortBy: "name" as const,
            sortOrder: "asc" as const,
        };
        let items = this.equipmentRepo.findAll();

        if (options.status) items = items.filter((item) => item.status === options.status);
        if (options.type) items = items.filter((item) => item.type === options.type);
        if (options.installedFrom) items = items.filter((item) => item.installedAt >= options.installedFrom!);
        if (options.installedTo) items = items.filter((item) => item.installedAt <= options.installedTo!);

        const direction = options.sortOrder === "asc" ? 1 : -1;
        items.sort((left, right) => {
            const leftValue = left[options.sortBy];
            const rightValue = right[options.sortBy];
            return String(leftValue).localeCompare(String(rightValue)) * direction;
        });

        const total = items.length;
        const start = (options.page - 1) * options.limit;

        return {
            data: items.slice(start, start + options.limit),
            meta: { total, page: options.page, limit: options.limit },
        };
    }

    findById(id: string): Equipment {
        const equipment = this.equipmentRepo.findById(id);

        if (!equipment) {
            throw new AppError(404, "Equipment not found");
        }

        return equipment;
    }

    create(input: CreateEquipmentInput): Equipment {
        if (this.equipmentRepo.findBySerialNumber(input.serialNumber)) {
            throw new AppError(409, "Serial number is already in use");
        }

        return this.equipmentRepo.create({
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
            const duplicate = this.equipmentRepo.findBySerialNumber(input.serialNumber);

            if (duplicate && duplicate.id !== id) {
                throw new AppError(409, "Serial number is already in use");
            }
        }

        const updated = this.equipmentRepo.update(id, input);

        if (!updated) {
            throw new AppError(404, "Equipment not found");
        }

        return updated;
    }

    delete(id: string): Equipment {
        const equipment = this.findById(id);
        const hasOpenMaintenanceRequest =
            this.maintenanceRequestRepo.hasOpenByEquipmentId(id);

        if (hasOpenMaintenanceRequest) {
            throw new AppError(409, "Equipment has open maintenance requests");
        }

        this.equipmentRepo.delete(id);

        return equipment;
    }
}

export const equipmentService = new EquipmentService();
