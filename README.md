# 📄 Prescriptions API

API simples em **Express + TypeScript** para processar arquivos CSV de prescrições médicas.
Foco em validações robustas, suporte a arquivos grandes via streaming e logs HTTP com [morgan](https://github.com/expressjs/morgan).

---

## 🚀 Features

- Upload de CSV (`multipart/form-data`).
- Processamento **streaming** (memória O(1)).
- **Validações médicas**:
  - `date` no formato `YYYY-MM-DD`, não futura.
  - `patient_cpf` com 11 dígitos.
  - `doctor_crm` numérico.
  - `doctor_uf` deve ser um estado válido (UF).
  - `duration` ≤ 90 dias (ou ≤ 60 dias se controlado).
  - Medicamentos controlados exigem `notes`.
  - `frequency` pode ser:
    - número (`8`)
    - intervalo (`8/8h`)
    - `"Se necessário"` (PRN)
- Logs HTTP simples com **morgan**.

---

## 📦 Instalação

```bash
git clone <repo>
cd prescriptions-api
pnpm install   # ou npm install / yarn install
```

---

## ▶️ Execução

Modo dev:
```bash
pnpm dev
```

Build + produção:
```bash
pnpm build
pnpm start
```

API: http://localhost:3000

---

## 📂 Endpoints
Upload de prescrições
POST `/api/prescriptions/upload`

Body: `multipart/form-data com` o campo file apontando para o CSV.

Resposta (202):
```json
{
  "upload_id": "uuid-gerado",
  "status": "processing",
  "total_records": 0,
  "processed_records": 0,
  "valid_records": 0,
  "errors": []
}
```

Consultar status
GET `/api/prescriptions/upload/:id`

Exemplo:
```json
{
  "upload_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "completed",
  "total_records": 150,
  "processed_records": 150,
  "valid_records": 140,
  "errors": [
    { "line": 5, "field": "patient_cpf", "message": "CPF deve ter 11 dígitos", "value": "12345" }
  ]
}
```

---

## 📝 Estrutura do CSV

Cabeçalho esperado:
```csv
id,date,patient_cpf,doctor_crm,doctor_uf,medication,controlled,dosage,frequency,duration,notes
```

Exemplo:
```csv
1,2024-09-01,12345678901,12345,SP,Amoxicilina,false,500mg,8/8h,7,---
2,2024-09-02,98765432100,54321,RJ,Diazepam,true,10mg,Se necessário,30,"Uso controlado"
```

---

## 🛠️ Logging

Usa morgan integrado ao Express.
Saída no console em formato `tiny/combined` (configurável).

Exemplo:
```swift
POST /api/prescriptions/upload 202 15.342 ms - 120
GET /api/prescriptions/upload/123e4567 200 3.210 ms - 450
```

---

## 💡 Exemplo de uso com curl
Upload
```bash
curl -F "file=@prescricoes.csv" http://localhost:3000/api/prescriptions/upload
```

Consultar status
```bash
curl http://localhost:3000/api/prescriptions/upload/<upload_id>
```

---

## ✅ Decisões técnicas

- Streaming com csv-parser → escalável para arquivos grandes.
- Zod para validação e normalização.
- Aceita tanto days (legado) quanto frequency (novo).
- Log HTTP simples (morgan) em vez de logger estruturado pesado → mais dev-friendly.

