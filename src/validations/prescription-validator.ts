import z from 'zod'
import dayjs from 'dayjs'

Campos Obrigatórios:

id: único no sistema
date: data válida
patient_cpf: 11 dígitos
doctor_crm: apenas números
doctor_uf: UF válida (2 letras)
medication: obrigatório
controlled: boolean (quando vazio considerar false)
dosage: obrigatório
duration: obrigatório
days: número positivo
Regras de Negócio:

duration: duração máxima de 90 dias
date: não pode ser futura
Medicamentos controlados (controlled=true) requerem observações
Medicamentos controlados (controlled=true) têm frequency máxima de 60 dias

export const Prescription = z.object({
  id: z.string().min(1),
  date: z.string(),
  patient_cpf: z.string().min(1).max(11),
  doctor_crm: z.string().min(1),
  medication: z.string(),
  controlled: z.union([z.string(), z.boolean()]),
  dosage: z.string(),
  duration: z.string(),
  days: z.string(),
  notes: z.string().nullable(),
})

