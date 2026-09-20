import { z } from "zod";

const prioritySchema = z.enum([
    "low",
    "medium",
    "high",
    "critical",
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

export type CreateMaintenanceRequestInput = z.infer<typeof createMaintenanceRequestSchema>;
