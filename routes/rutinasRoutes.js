import express from 'express'
import { generarRecompensa } from '../controllers/recompensaController.js'

import {
  crearRutina,
  obtenerRutinas,
  obtenerRutina,
  eliminarRutina,
  completarRutina,
} from '../controllers/rutinaController.js'

const router = express.Router()

//Recompensa
router.post('/generar', generarRecompensa)

//Rutina
router.post('/', crearRutina)
router.post('/completado', completarRutina)
router.get('/', obtenerRutinas)
router.get('/:id', obtenerRutina)
router.delete('/:id', eliminarRutina)

export default router
