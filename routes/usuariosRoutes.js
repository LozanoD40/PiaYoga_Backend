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
  guardarHorario,
  obtenerHorario,
  cambiarEstadoHorario,
} from '../controllers/usuarioHorarioController.js'

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

import {
  asignarRutina,
  obtenerMisRutinas,
  marcarProgreso,
  completarRutina,
  eliminarRutina
} from '../controllers/usuarioRutinaController.js'

import {
  asignarRetoAUsuario,
  obtenerMisRetos,
  completarPostura,
  finalizarReto,
  eliminarUsuarioReto,
} from '../controllers/usuarioRetoController.js'

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

//Horario
router.post('/horario', verificarToken, guardarHorario)
router.get('/horario', obtenerHorario)
router.patch('/horario/estado', verificarToken, cambiarEstadoHorario)

// Inventario del usuario
router.get('/inventario', verificarToken, obtenerMiInventario)
router.post('/inventario', verificarToken, crearInventario)
router.post('/inventario/agregar', verificarToken, agregarAccesorio)
router.post('/inventario/remover', verificarToken, removerAccesorio)

  // Personaje
router.get('/personaje', obtenerMiPersonaje)
router.post('/personaje', crearPersonajeInicial)
router.patch('/personaje/equipar', equiparAccesorio)
router.patch('/personaje/reset-slot', resetSlot)
router.patch('/personaje/reset-todo', resetTodo)

// Rutinas del usuario
router.post('/rutina', verificarToken, asignarRutina)
router.get('/rutina', verificarToken, obtenerMisRutinas)
router.post('/progreso', verificarToken, marcarProgreso)
router.post('/completar', verificarToken, completarRutina)
router.delete('/:rutinaId', verificarToken, eliminarRutina)

// Retos del usuario
router.post('/reto', verificarToken, asignarRetoAUsuario)
router.get('/reto', verificarToken, obtenerMisRetos)
router.post('/reto/completar-postura', verificarToken, completarPostura)
router.post('/reto/finalizar', verificarToken, finalizarReto)
router.delete('/reto/:id', verificarToken, eliminarUsuarioReto)
export default router
