// routes/posturaRoutes.js
import express from 'express'
import {
  crearPostura,
  obtenerPosturas,
  obtenerPostura,
  actualizarPostura,
  eliminarPostura,
} from '../controllers/posturaController.js'

import { verificarToken, soloAdmin } from '../middleware/auth.js'

const router = express.Router()

// Público puede ver posturas
router.get('/', obtenerPosturas)
router.get('/:id', obtenerPostura)

// Solo admin crea, edita, elimina
router.post('/', verificarToken, soloAdmin, crearPostura)
router.put('/:id', verificarToken, soloAdmin, actualizarPostura)
router.delete('/:id', verificarToken, soloAdmin, eliminarPostura)

export default router
