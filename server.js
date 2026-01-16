import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { handleError } from './utils/errorHandler.js'
import { connectDB } from './config/db.js'
dotenv.config()

// Importar rutas
import logrosRoutes from './routes/logrosRoutes.js'
import consejosRoutes from './routes/consejosRoutes.js'
import posturaRoutes from './routes/posturasRoutes.js'
import rutinasRoutes from './routes/rutinasRoutes.js'
import usuariosRoutes from './routes/usuariosRoutes.js'

const app = express()
const port = process.env.PORT || 3000

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://lozanod40.github.io',
      'https://lozanod40.github.io/PiaYoga_Frontend'
    ],
    credentials: true,
  })
)

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

connectDB()

// Rutas principales
app.use('/api/logros', logrosRoutes)
app.use('/api/consejos', consejosRoutes)
app.use('/api/posturas', posturaRoutes)
app.use('/api/rutinas', rutinasRoutes)
app.use('/api/usuarios', usuariosRoutes)

// Middleware global de errores (AL FINAL SIEMPRE)
app.use(handleError)

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})
