import express from 'express'
import { soloAdmin, verificarToken } from '../middleware/auth.js'

import {
  crearLogro,
  obtenerLogros,
  obtenerLogro,
  obtenerLogrosPorTipo,
  actualizarLogro,
  eliminarLogro,
} from '../controllers/logroController.js'

const router = express.Router()

/* ======================================
   Logros públicos
====================================== */
router.get('/', obtenerLogros)
router.get('/tipo/:tipo', obtenerLogrosPorTipo)
router.get('/:id', obtenerLogro)

/* ======================================
   Logros admin
====================================== */
router.post('/', verificarToken, soloAdmin, crearLogro)
router.put('/:id', verificarToken, soloAdmin, actualizarLogro)
router.delete('/:id', verificarToken, soloAdmin, eliminarLogro)

export default router
