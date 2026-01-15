import express from 'express'

import {
  crearRutina,
  obtenerRutinas,
  obtenerRutinaPorId,
  actualizarRutina,
  eliminarRutina,
} from '../controllers/rutinaController.js'

import {
  crearMusica,
  listarMusica,
  obtenerMusica,
  editarMusica,
  eliminarMusica,
} from '../controllers/musicaController.js'

import { verificarToken, soloAdmin } from '../middleware/auth.js'

const router = express.Router()

/* MÚSICA */
router.get('/musica', listarMusica)
router.get('/musica/:id', obtenerMusica)
router.post('/musica', verificarToken, soloAdmin, crearMusica)
router.put('/musica/:id', verificarToken, soloAdmin, editarMusica)
router.delete('/musica/:id', verificarToken, soloAdmin, eliminarMusica)

/* RUTINAS */
router.get('/', obtenerRutinas)
router.get('/:id', obtenerRutinaPorId)
router.post('/', crearRutina)
router.put('/:id', verificarToken, soloAdmin, actualizarRutina)
router.delete('/:id', verificarToken, soloAdmin, eliminarRutina)

export default router
