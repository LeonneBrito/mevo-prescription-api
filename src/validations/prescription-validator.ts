import z from "zod";
import dayjs from "dayjs";
import { UF_LIST } from "src/constants/uf";
import type { Prescription } from "src/types";

export const prescriptionSchema = z.object({
  id: z.string().min(1),
  date: z
    .string()
    .refine(
      (d) =>
        dayjs(d, "YYYY-MM-DD", true).isValid() && !dayjs(d).isAfter(dayjs()),
      "Data inválida ou futura (use YYYY-MM-DD)"
    ),
  patient_cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos"),
  doctor_crm: z.string().regex(/^\d+$/, "CRM inválido"),
  doctor_uf: z
    .string()
    .toUpperCase()
    .refine((uf) => UF_LIST.includes(uf), "UF inválida"),
  medication: z.string().min(1, "Medicamento obrigatório"),
  controlled: z.union([z.boolean(), z.string()]).transform((v) => {
    if (typeof v === "boolean") return v;
    if (v === "" || v.toLowerCase() === "false") return false;
    if (v.toLowerCase() === "true") return true;
    return false;
  }),
  dosage: z.string().min(1, "Dosagem obrigatória"),
  days: z
    .string()
    .refine(
      (val) =>
        val === "Se necessário" ||
        /^\d+$/.test(val) ||
        /^\d{1,2}\/\d{1,2}h$/.test(val),
      "days deve ser número positivo, intervalo tipo '8/8h' ou 'Se necessário'"
    ),
  duration: z.coerce
    .number()
    .int()
    .positive({
      message: "Duração deve ser número inteiro positivo",
    })
    .max(90, {
      message: "Duração máxima é 90 dias",
    }),
  notes: z.string().optional().nullable(),
});

export function validateControlledPrescription(prescription: Prescription) {
  const errors: { field: keyof Prescription; message: string }[] = [];

  if (prescription.controlled) {
    if (!prescription.notes || prescription.notes.trim().length === 0) {
      errors.push({
        field: "notes",
        message: "Medicamentos controlados requerem observações",
      });
    }
    if (prescription.duration > 60) {
      errors.push({
        field: "duration",
        message: "Para controlados, duração máxima é 60 dias",
      });
    }
  }

  return errors;
}
