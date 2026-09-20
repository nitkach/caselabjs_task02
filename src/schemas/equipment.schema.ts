import { z } from "zod";

const equipmentTypeSchema = z.enum([
    "turbine",
    "inverter",
    "sensor",
    "substation",
]);

const equipmentStatusSchema = z.enum([
    "operational",
    "maintenance",
    "fault",
    "decommissioned",
]);

const locationSchema = z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
});

const installedAtSchema = z.iso.datetime().refine(
    (value) => new Date(value).getTime() <= Date.now(),
    "Дата установки не может быть в будущем",
);

export const createEquipmentSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Имя должно содержать минимум 3 символа")
        .max(100, "Имя должно содержать максимум 100 символов"),

    type: equipmentTypeSchema,

    serialNumber: z
        .string()
        .trim()
        .min(1, "Серийный номер обязателен"),

    location: locationSchema,

    status: equipmentStatusSchema,

    installedAt: installedAtSchema,
});

export const updateEquipmentSchema = createEquipmentSchema.partial();

export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>;
export type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>;
