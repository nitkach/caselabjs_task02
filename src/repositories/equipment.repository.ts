import type { Equipment } from "../models/equipment.model.js";

export class EquipmentRepository {
    private readonly equipment = new Map<string, Equipment>();

    findAll(): Equipment[] {
        return [...this.equipment.values()];
    }

    findById(id: string): Equipment | undefined {
        return this.equipment.get(id);
    }

    findBySerialNumber(serialNumber: string): Equipment | undefined {
        return [...this.equipment.values()].find(
            (item) => item.serialNumber === serialNumber,
        );
    }

    create(item: Equipment): Equipment {
        this.equipment.set(item.id, item);
        return item;
    }
}

export const equipmentRepository = new EquipmentRepository();
