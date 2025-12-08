import express from 'express'
import { soloAdmin, verificarToken } from '../middleware/auth.js'
import {
  crearConsejo,
  listarConsejos,
  obtenerConsejo,
  actualizarConsejo,
  eliminarConsejo,
  cambiarEstadoConsejo,
} from '../controllers/consejoController.js'

const router = express.Router()

// Consejos
router.post('/', crearConsejo)
router.get('/', listarConsejos)
router.get('/:id', obtenerConsejo)
router.put('/:id', verificarToken, soloAdmin, actualizarConsejo)
router.delete('/:id', verificarToken, soloAdmin, eliminarConsejo)
router.patch(
  '/estado/:id',
  verificarToken,
  soloAdmin,
  cambiarEstadoConsejo
)

export default router