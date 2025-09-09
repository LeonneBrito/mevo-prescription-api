import crypto from "node:crypto";
import fs from "node:fs";
import csv from "csv-parser";
import { data, uploads } from "src/stores";
import type { Prescription, UploadReport } from "src/types";
import {
  prescriptionSchema,
  validateControlledPrescription,
} from "src/validations/prescription-validator";
import { normalizedRow } from "src/utils/normalized-row";

export function queue(filePath: string) {
  const uploadId = crypto.randomUUID();
  const report: UploadReport = {
    upload_id: uploadId,
    status: "processing",
    total_records: 0,
    processed_records: 0,
    valid_records: 0,
    errors: [],
  };
  uploads.set(uploadId, report);

  processFile(uploadId, filePath);
  return report;
}

function processFile(uploadId: string, filePath: string) {
  const report = uploads.get(uploadId)!;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      report.total_records++;
      const parsed = prescriptionSchema.safeParse(normalizedRow(row));

      if (!parsed.success) {
        parsed.error.issues.forEach((e) => {
          report.errors.push({
            line: report.total_records + 1,
            field: e.path[0]?.toString() ?? "unknown",
            message: e.message,
            value: (row as any)[e.path[0] as any],
          });
        });
      } else {
        const record = parsed.data as Prescription;
        const bizErrors = validateControlledPrescription(record);

        if (bizErrors.length) {
          bizErrors.forEach((be) => {
            report.errors.push({
              line: report.total_records + 1,
              field: be.field,
              message: be.message,
              value: (record as any)[be.field],
            });
          });
        } else if (data.has(record.id)) {
          report.errors.push({
            line: report.total_records + 1,
            field: "id",
            message: "ID duplicado no sistema",
            value: record.id,
          });
        } else {
          data.set(record.id, record);
          report.valid_records++;
        }
      }

      report.processed_records++;
    })
    .on("end", () => {
      report.status = "completed";
      fs.promises.unlink(filePath).catch(() => {});
    })
    .on("error", (err: { message: any }) => {
      report.status = "failed";
      report.errors.push({ line: 0, field: "file", message: err.message });
    });
}
