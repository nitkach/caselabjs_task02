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
    "rejected"
]);

const plannedAt = z.iso.datetime().refine(
    (value) => new Date(value).getTime() > Date.now(),
    "Дата планирумой установки не может быть в прошлом",
);

export const createMaintenanceRequestSchema = z.object({
    equipmentId: z
        .string()
        .trim()
        .min(3, "Имя должно содержать минимум 3 символа")
        .max(100, "Имя должно содержать максимум 100 символов"),

    title: z
        .string()
        .trim()
        .min(5, "Название должно содержать минимум 5 символов")
        .max(120, "Название должно содержать максимум 120 символов"),

    description: z
        .string()
        .trim()
        .max(2000, "Описание должно содержать максимум 2000 символов"),

    priority: prioritySchema,

    status: statusSchema.default("new"),

    plannedAt: plannedAt.optional()
});

export type CreateMaintenanceRequestInput = z.infer<typeof createMaintenanceRequestSchema>;
