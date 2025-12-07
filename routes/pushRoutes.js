import express from 'express'
import {
  guardarSuscripcion,
  enviarNotificacionUsuario,
  enviarPrueba,
} from '../controllers/pushController.js'
import { verificarToken } from '../middleware/auth.js'

const router = express.Router()

// Guardar suscripción (frontend)
router.post('/subscribe', verificarToken, guardarSuscripcion)

// Enviar notificación personalizada a usuario (admin o sistema)
router.post('/send-to-user', verificarToken, enviarNotificacionUsuario) // puedes restringir soloAdmin según lo necesites

// Prueba (usuario autenticado)
router.post('/test', verificarToken, enviarPrueba)

export default router
