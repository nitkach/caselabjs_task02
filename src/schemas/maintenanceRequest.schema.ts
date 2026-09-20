import { z } from "zod";

const prioritySchema = z.enum([
    "low",
    "medium",
    "high",
    "critical",
]);

const statusSchema = z.enum([
    "new",
    "in_progress",
    "done",
    "rejected",
]);

export const createMaintenanceRequestSchema = z.object({
    equipmentId: z.uuid(),

    title: z
        .string()
        .trim()
        .min(5, "Название должно содержать минимум 5 символов")
        .max(120, "Название должно содержать максимум 120 символов"),

    description: z
        .string()
        .trim()
        .max(2000, "Описание должно содержать максимум 2000 символов")
        .optional(),

    priority: prioritySchema,

    plannedAt: z.iso.datetime().optional(),
});

export const updateMaintenanceRequestSchema = z.object({
    title: createMaintenanceRequestSchema.shape.title.optional(),
    description: createMaintenanceRequestSchema.shape.description,
    priority: prioritySchema.optional(),
    plannedAt: createMaintenanceRequestSchema.shape.plannedAt,
});

export const updateMaintenanceRequestStatusSchema = z.object({
    status: statusSchema,
});

export type CreateMaintenanceRequestInput = z.infer<typeof createMaintenanceRequestSchema>;
export type UpdateMaintenanceRequestInput = z.infer<typeof updateMaintenanceRequestSchema>;
export type UpdateMaintenanceRequestStatusInput = z.infer<
    typeof updateMaintenanceRequestStatusSchema
>;
