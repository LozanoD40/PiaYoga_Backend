import express from 'express'
import { soloAdmin, verificarToken } from '../middleware/auth.js'
import {
  crearAccesorio,
  obtenerAccesorios,
  obtenerPorCategoria,
  obtenerAccesorio,
  actualizarAccesorio,
  eliminarAccesorio,
} from '../controllers/accesorioController.js'


const router = express.Router()

// ACCESORIOS 
router.get('/', obtenerAccesorios)
router.get('/categoria/:categoria', obtenerPorCategoria)
router.get('/:id', obtenerAccesorio)

router.post('/', verificarToken, soloAdmin, crearAccesorio)
router.put('/:id', verificarToken, soloAdmin, actualizarAccesorio)
router.delete('/:id', verificarToken, soloAdmin, eliminarAccesorio)

export default router
