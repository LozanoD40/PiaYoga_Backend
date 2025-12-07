import express from 'express'
import {
  crearReto,
  obtenerRetos,
  obtenerReto,
  actualizarReto,
  eliminarReto,
} from '../controllers/retoController.js'

const router = express.Router()

router.post('/', crearReto) // Crear reto
router.get('/', obtenerRetos) // Lista de retos
router.get('/:id', obtenerReto) // Obtener uno
router.put('/:id', actualizarReto) // Editar
router.delete('/:id', eliminarReto) // Eliminar

export default router
