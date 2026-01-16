import express from 'express'
import {
  registrar,
  login,
  perfil,
  actualizarPerfil,
  listarUsuarios,
  cambiarRol,
  cambiarEstado,
  eliminarUsuario,
} from '../controllers/usuarioController.js'

import {
  obtenerDatos,
  actualizaDatos,
  obtenerMisLogros,
  desbloquearLogro,
} from '../controllers/usuarioInventarioController.js'

import {
  asignarRutina,
  obtenerMisRutinas,
  registrarProgreso,
  completarRutina,
  eliminarRutinaUsuario,
} from '../controllers/usuarioRutinaController.js'

import { verificarToken, soloAdmin } from '../middleware/auth.js'
import { uploadAvatar } from '../middleware/uploadAvatar.js'

const router = express.Router()

// Público
router.post('/registrar', registrar)
router.post('/login', login)

// Privado
router.get('/perfil', verificarToken, perfil)
router.put(
  '/perfil',
  verificarToken,
  uploadAvatar.single('avatar'),
  actualizarPerfil
)

router.get('/datos', verificarToken, obtenerDatos)
router.put('/datos', verificarToken, actualizaDatos)

// Logros
router.get('/logros', verificarToken, obtenerMisLogros)
router.post('/logros', verificarToken, desbloquearLogro)

// Rutinas del usuario
router.post('/rutina', verificarToken, asignarRutina)
router.get('/rutina', verificarToken, obtenerMisRutinas)
router.post('/progreso', verificarToken, registrarProgreso)
router.post('/completar', verificarToken, completarRutina)
router.delete('/:rutinaId', verificarToken, eliminarRutinaUsuario)

// Admin
router.get('/', verificarToken, soloAdmin, listarUsuarios)
router.put('/rol/:id', verificarToken, soloAdmin, cambiarRol)
router.put('/estado/:id', verificarToken, soloAdmin, cambiarEstado)
router.delete('/:id', verificarToken, soloAdmin, eliminarUsuario)

export default router
