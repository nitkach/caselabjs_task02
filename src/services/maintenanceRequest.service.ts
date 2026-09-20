import type {
    MaintenanceRequest,
} from "../models/maintenanceRequest.model.js";
import { EquipmentRepository, equipmentRepository } from "../repositories/equipment.repository.js";
import { MaintenanceRequestRepository, maintenanceRequestRepository } from "../repositories/maintenanceRequest.repository.js";
import { AppError } from "../utils/appError.js";

export class MaintenanceRequestService {
    constructor(
        private readonly equipmentRepo: EquipmentRepository = equipmentRepository,
        private readonly maintenanceRequestRepo: MaintenanceRequestRepository = maintenanceRequestRepository,
    ) { }

    findByEquipmentId(equipmentId: string): MaintenanceRequest[] {
        const equipment = this.equipmentRepo.findById(equipmentId);

        if (!equipment) {
            throw new AppError(404, "Equipment not found");
        }

        return this.maintenanceRequestRepo.findByEquipmentId(equipmentId);
    }
}

export const maintenanceRequestService = new MaintenanceRequestService();
