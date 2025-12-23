import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { handleError } from './utils/errorHandler.js'
import { connectDB } from './config/db.js'
dotenv.config()

// Importar rutas
import accesoriosRoutes from './routes/accesoriosRoutes.js'
import consejosRoutes from './routes/consejosRoutes.js'
import horariosRoutes from './routes/horariosRoutes.js'
import posturaRoutes from './routes/posturasRoutes.js'
import pushRoutes from './routes/pushRoutes.js'
import rutinasRoutes from './routes/rutinasRoutes.js'
import usuariosRoutes from './routes/usuariosRoutes.js'

const app = express()
const port = process.env.PORT || 3000

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://lozanod40.github.io',
      'https://lozanod40.github.io/PiaYoga_Frontend',
    ],
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectDB()

// Rutas principales
app.use('/api/accesorios', accesoriosRoutes)
app.use('/api/consejos', consejosRoutes)
app.use('/api/horarios', horariosRoutes)
app.use('/api/posturas', posturaRoutes)
app.use('/api/push', pushRoutes)
app.use('/api/rutinas', rutinasRoutes)
app.use('/api/usuarios', usuariosRoutes)

// Middleware global de errores (AL FINAL SIEMPRE)
app.use(handleError)

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})
