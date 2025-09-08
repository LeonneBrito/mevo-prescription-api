export type UploadStatus = 'processing' | 'completed' | 'failed'

export interface UploadReportError {
  line: number;
  field: string;
  message: string;
  value: string;
}

export interface UploadReport {
  upload_id: string
  status: UploadStatus
  total_records: number;
  processed_records: number;
  valid_records: number;
  errors: UploadReportError[]
}

export interface Prescription {
  id: string;
  date: string;
  patient_cpf: string;
  doctor_crm: string;
  doctor_uf: string;
  medication: string;
  controlled: string;
  dosage: string
  duration: string;
  days: string;
  notes?: string | null;
}