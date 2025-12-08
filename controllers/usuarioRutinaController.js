import UsuarioRutina from '../models/usuarioRutina.js'
import Postura from '../models/postura.js'
import Rutina from '../models/rutina.js'
import Usuario from '../models/usuario.js'
import { calcularNivel } from '../utils/calculateLevel.js'
import { createError } from '../utils/errorHandler.js'
import { generarRecompensa } from '../controllers/recompensaController.js'

export const generarRutinaPersonalizada = async (req, res, next) => {
  try {
    const { peso, edad, estiloVida } = req.body
    const usuarioId = req.usuario.id

    if (!peso || !edad || !estiloVida)
      return next(createError(400, 'Faltan datos obligatorios'))

    const nivel = calcularNivel(peso, edad, estiloVida)

    const posturas = await Postura.find({ nivel })

    if (posturas.length === 0)
      return next(createError(404, 'No existen posturas para ese nivel'))

    const progresion = [
      { semana: 1, duracionMinutos: 10, intensidad: 'baja' },
      { semana: 2, duracionMinutos: 15, intensidad: 'media' },
      { semana: 3, duracionMinutos: 20, intensidad: 'media' },
      { semana: 4, duracionMinutos: 25, intensidad: 'alta' },
    ]

    const nuevaRutina = await UsuarioRutina.create({
      usuario: usuarioId,
      tipo: 'personalizado',
      datosPersonales: { peso, edad, estiloVida, nivel },
      posturas: posturas.map((p) => p._id),
      progresion,
    })

    res.status(201).json({
      mensaje: 'Rutina personalizada creada',
      rutina: nuevaRutina,
    })
  } catch (error) {
    next(error)
  }
}

export const asignarRutinaExistente = async (req, res, next) => {
  try {
    const { rutinaId } = req.body
    const usuarioId = req.usuario.id

    const rutina = await Rutina.findById(rutinaId).populate('posturas')
    if (!rutina) return next(createError(404, 'Rutina no encontrada'))

    const nueva = await UsuarioRutina.create({
      usuario: usuarioId,
      tipo: rutina.tipo,
      rutina: rutinaId,
      posturas: rutina.posturas.map((p) => p._id),
      progresion: [],
    })

    res.json({
      mensaje: 'Rutina asignada al usuario',
      rutina: nueva,
    })
  } catch (error) {
    next(error)
  }
}

export const completarUsuarioRutina = async (req, res, next) => {
  try {
    const { usuarioRutinaId } = req.body
    const usuarioId = req.usuario.id

    const ur = await UsuarioRutina.findById(usuarioRutinaId)
      .populate('posturas')
      .populate('rutina')
    if (!ur) return next(createError(404, 'Rutina de usuario no encontrada'))

    let totalPuntos = 0
    let totalDinero = 0
    let recompensas = []

    // Recompensa por cada postura
    for (const postura of ur.posturas) {
      const response = await generarRecompensa(
        { body: { usuarioId, posturaId: postura._id } },
        { status: () => ({ json: () => {} }) }
      )

      recompensas.push(response.recompensa)
      totalPuntos += response.recompensa.puntos
      totalDinero += response.recompensa.dinero
    }

    // Bono extra si es RETO
    let recompensaExtra = null
    if (ur.tipo === 'reto' && ur.rutina?.recompensaExtra) {
      const usuario = await Usuario.findById(usuarioId)

      usuario.puntos += ur.rutina.recompensaExtra.puntos
      usuario.dinero += ur.rutina.recompensaExtra.dinero

      await usuario.save()

      recompensaExtra = ur.rutina.recompensaExtra
    }

    ur.completado = true
    ur.fechaCompletado = new Date()
    ur.totalPuntosGanados = totalPuntos
    ur.totalDineroGanado = totalDinero
    await ur.save()

    res.json({
      mensaje: 'Rutina completada',
      totalPuntos,
      totalDinero,
      recompensaExtra,
      recompensas,
    })
  } catch (error) {
    next(error)
  }
}