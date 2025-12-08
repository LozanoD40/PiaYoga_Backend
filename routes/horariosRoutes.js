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
router.get('/', listarHorarios)

// ADMIN
router.post('/', crearHorario)
router.put('/:id', verificarToken, soloAdmin, editarHorario)
router.delete('/:id', verificarToken, soloAdmin, eliminarHorario)

export default router
