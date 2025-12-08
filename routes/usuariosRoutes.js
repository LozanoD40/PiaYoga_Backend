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
  generarRutinaPersonalizada,
  asignarRutinaExistente,
  completarUsuarioRutina,
} from '../controllers/usuarioRutinaController.js'

import {
  guardarHorario,
  obtenerHorario,
  cambiarEstadoHorario,
} from '../controllers/usuarioHorarioController.js'

import {
  iniciarReto,
  completarPostura,
  completarReto,
  obtenerMisRetos,
} from '../controllers/usuarioRetoController.js'

import {
  obtenerMiInventario,
  crearInventario,
  agregarAccesorio,
  removerAccesorio,
} from '../controllers/usuarioInventarioController.js'

import {
  obtenerMiPersonaje,
  crearPersonajeInicial,
  equiparAccesorio,
  resetSlot,
  resetTodo,
} from '../controllers/usuarioPersonajeController.js'

import { verificarToken, soloAdmin } from '../middleware/auth.js'

const router = express.Router()

// Público
router.post('/registrar', registrar)
router.post('/login', login)

// Privado
router.get('/perfil', verificarToken, perfil)
router.put('/perfil', verificarToken, actualizarPerfil)

// Admin
router.get('/', verificarToken, soloAdmin, listarUsuarios)
router.put('/rol/:id', verificarToken, soloAdmin, cambiarRol)
router.put('/estado/:id', verificarToken, soloAdmin, cambiarEstado)
router.delete('/:id', verificarToken, soloAdmin, eliminarUsuario)

// Rutinas personalizadas
router.post('/personalizada', generarRutinaPersonalizada)
router.post('/asignar', asignarRutinaExistente)
router.post('/completar', completarUsuarioRutina)

//Horario
router.post('/horario', verificarToken, guardarHorario)
router.get('/horario', obtenerHorario)
router.patch('/horario/estado', verificarToken, cambiarEstadoHorario)

// Inventario del usuario
router.get('/inventario', verificarToken, obtenerMiInventario)
router.post('/inventario', verificarToken, crearInventario)
router.post('/inventario/agregar', verificarToken, agregarAccesorio)
router.post('/inventario/remover', verificarToken, removerAccesorio)

// RETOS DEL USUARIO
router.post('/retos/iniciar', verificarToken, iniciarReto)
router.post('/retos/completar-postura', verificarToken, completarPostura)
router.post('/retos/completar', verificarToken, completarReto)
router.get('/retos', verificarToken, obtenerMisRetos)

  // Personaje
router.get('/personaje', obtenerMiPersonaje)
router.post('/personaje', crearPersonajeInicial)
router.patch('/personaje/equipar', equiparAccesorio)
router.patch('/personaje/reset-slot', resetSlot)
router.patch('/personaje/reset-todo', resetTodo)

export default router
