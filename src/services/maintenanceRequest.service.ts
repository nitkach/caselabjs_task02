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
        if (this.equipmentRepo.findBySerialNumber(input.serialNumber)) {
            throw new AppError(409, "Serial number is already in use");
        }

        return this.equipmentRepo.create({
            id: randomUUID(),
            ...input,
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
