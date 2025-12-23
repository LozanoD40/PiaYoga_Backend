import express from 'express'
import {
  crearRutina,
  obtenerRutinas,
  obtenerRutinaPorId,
  actualizarRutina,
  eliminarRutina,
} from '../controllers/rutinaController.js'

import {
  crearReto,
  listarRetos,
  listarRetosActivos,
  retosPorRutina,
  obtenerReto,
  actualizarReto,
  cambiarEstadoReto,
  eliminarReto,
} from '../controllers/retoController.js'

import { generarRecompensa } from '../controllers/recompensaController.js';
import { verificarToken, soloAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', obtenerRutinas)
router.get('/:id', obtenerRutinaPorId)
router.post('/', verificarToken, crearRutina)
router.put('/:id', verificarToken, soloAdmin, actualizarRutina)
router.delete('/:id', verificarToken, soloAdmin, eliminarRutina)

//recompensa
router.post('/generar/:rutinaId', verificarToken, generarRecompensa)

// Retos
router.post('/reto', verificarToken, soloAdmin, crearReto);
router.get('/reto', verificarToken, soloAdmin, listarRetos)
router.get('/reto/:id', verificarToken, soloAdmin, obtenerReto)
router.put('/reto/:id', verificarToken, soloAdmin, actualizarReto)
router.patch('/reto/:id/estado', verificarToken, soloAdmin, cambiarEstadoReto)
router.delete('/reto/:id', verificarToken, soloAdmin, eliminarReto)
router.get('/public/activos', listarRetosActivos);
router.get('/public/rutina/:rutinaId', retosPorRutina);
export default router
