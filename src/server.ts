import express from "express";
import cors from "cors";
import morgan from "morgan";
import prescriptionRouter from "./routes/prescription";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.send({ ok: true });
});

app.use(prescriptionRouter);

app.use((_req, res) => res.status(404).json({ error: "Não encontrado" }));

app.use((err: any, _req: any, res: any, _next: any) => {
  res.status(500).json({ error: "Erro interno do servidor" });
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log("Server rodando na porta", port);
});
