import PushSubscription from '../models/pushSubscription.js'
import webpush from '../utils/pushConfig.js'
import { AppError } from '../utils/errorHandler.js'

// Guardar/actualizar suscripción (frontend envía la subscription JSON)
// Requiere usuario autenticado para asociarla al user (recomendado)
export const guardarSuscripcion = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id || null
    const subscription = req.body

    if (!subscription || !subscription.endpoint) {
      return next(new AppError('Suscripción inválida', 400))
    }

    // Upsert: si existe con el mismo endpoint lo reemplazamos
    const existing = await PushSubscription.findOneAndUpdate(
      { 'subscription.endpoint': subscription.endpoint },
      { subscription, usuario: usuarioId },
      { upsert: true, new: true }
    )

    res.status(201).json({ message: 'Suscripción guardada', data: existing })
  } catch (error) {
    next(error)
  }
}

// Enviar notificación a un usuario (busca todas sus suscripciones y las notifica)
export const enviarNotificacionUsuario = async (req, res, next) => {
  try {
    const { usuarioId, payload } = req.body
    if (!usuarioId) return next(new AppError('usuarioId requerido', 400))

    const subs = await PushSubscription.find({ usuario: usuarioId })

    if (!subs || subs.length === 0) {
      return res
        .status(200)
        .json({ message: 'No hay suscripciones para este usuario' })
    }

    const notifications = subs.map((s) => {
      return webpush
        .sendNotification(s.subscription, JSON.stringify(payload))
        .catch((err) => {
          // Si endpoint expiró o es inválido, lo eliminamos
          if (err.statusCode === 410 || err.statusCode === 404) {
            return PushSubscription.deleteOne({ _id: s._id })
          }
          console.error('Error enviando push:', err)
        })
    })

    await Promise.all(notifications)

    res.json({ message: 'Notificaciones enviadas' })
  } catch (error) {
    next(error)
  }
}

// Endpoint útil para enviar un push de prueba a la suscripción actual del usuario
export const enviarPrueba = async (req, res, next) => {
  try {
    const usuarioId = req.user?.id
    if (!usuarioId) return next(new AppError('Autenticación requerida', 401))

    const sub = await PushSubscription.findOne({ usuario: usuarioId })
    if (!sub) return next(new AppError('No tienes suscripción guardada', 404))

    const payload = {
      title: 'Prueba de notificación',
      body: '¡Funciona! Esta es una notificación de prueba.',
      icon: '/icons/icon-192.png',
      url: '/',
    }

    await webpush.sendNotification(sub.subscription, JSON.stringify(payload))

    res.json({ message: 'Notificación de prueba enviada' })
  } catch (error) {
    next(error)
  }
}
