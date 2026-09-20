export type MaintenanceRequestPriority =
    | "low"
    | "medium"
    | "high"
    | "critical";

export type MaintenanceRequestStatus =
    | "new"
    | "in_progress"
    | "done"
    | "rejected";

export interface Location {
    lat: number;
    lon: number;
}

export interface MaintenanceRequest {
    id: string;
    equipmentId: string
    title: string,
    description: string,
    priority: string,
    status: string,
    plannedAt: string,
    createdAt: string,
    updatedAt: string,
}
