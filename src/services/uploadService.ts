import crypto from 'node:crypto'
import { uploads } from 'src/stores';
import type { UploadReport } from 'src/types';

export function queue(filePath: string) {
  const uploadId = crypto.randomUUID();
  const report: UploadReport = {
    upload_id: uploadId,
    processed_records: 0,
    status: 'processing',
    total_records: 0,
    valid_records: 0,
    errors: []
  }
  uploads.set(uploadId, report);
  return report;
}

export function processFile(uploadId: string, filePath: string) {}