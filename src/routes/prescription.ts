import { Router } from "express";
import { upload } from "src/config/upload";
import { queue } from "src/services/uploadService";
import { uploads } from "src/stores";

const router = Router();

router.post("/api/prescriptions/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    res
      .status(400)
      .send({
        message: "Deve conter um arquivo do tipo CSV no corpo da requisição",
      });
  }

  const upload = queue(req.file.path);
  const prescription = uploads.get(upload.upload_id)!;
  res.status(200).json(prescription);
});

router.get("/api/prescriptions/upload/:id", (req, res) => {
  const uploadId = req.params.id;
  const prescription = uploads.get(uploadId)!;
  if (!prescription) {
    res.status(404).send({ error: "Upload não existe" });
  }
  res.json(prescription);
});

export default router;
