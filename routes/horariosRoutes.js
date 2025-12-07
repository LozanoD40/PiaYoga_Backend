import express from 'express'
import {
  crearHorario,
  listarHorarios,
  editarHorario,
  eliminarHorario,
} from '../controllers/horarioController.js'

import { verificarToken, soloAdmin } from '../middleware/auth.js'

const router = express.Router()

// PUBLICO / PRIVADO
router.get('/', verificarToken, listarHorarios)

// ADMIN
router.post('/', verificarToken, soloAdmin, crearHorario)
router.put('/:id', verificarToken, soloAdmin, editarHorario)
router.delete('/:id', verificarToken, soloAdmin, eliminarHorario)

export default router
