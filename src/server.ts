import express from 'express';
import cors from 'cors'
import prescriptionRouter from './routes/prescription'

const app = express();
app.use(express.json())
app.use(cors())

app.get('/health', (req, res) => {
  res.send({ ok: true })
})

app.use(prescriptionRouter)

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log('Server rodando')
})