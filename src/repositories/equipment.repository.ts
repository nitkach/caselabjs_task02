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

    update(id: string, changes: Partial<Equipment>): Equipment | undefined {
        const current = this.equipment.get(id);

        if (!current) {
            return undefined;
        }

        const updated = {
            ...current,
            ...changes,
            id: current.id,
        };

        this.equipment.set(id, updated);
        return updated;
    }

    delete(id: string): Equipment | undefined {
        const current = this.equipment.get(id);

        if (!current) {
            return undefined;
        }

        this.equipment.delete(id);
        return current;
    }
}

export const equipmentRepository = new EquipmentRepository();
