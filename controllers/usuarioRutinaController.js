import UsuarioRutina from '../models/usuarioRutina.js'
import { calcularNivel } from '../utils/calculateLevel.js'
import { createError } from '../utils/errorHandler.js'

export const generarRutinaPersonalizada = async (req, res, next) => {
  try {
    const { peso, edad, estiloVida } = req.body
    const usuarioId = req.usuario.id

    if (!peso || !edad || !estiloVida) {
      return next(createError(400, 'Faltan datos obligatorios'))
    }

    const nivel = calcularNivel(peso, edad, estiloVida)

    const posturas = await Rutina.find({ nivel })

    if (posturas.length === 0) {
      return next(createError(404, 'No existen posturas para ese nivel'))
    }

    const progresion = [
      { semana: 1, duracionMinutos: 10, intensidad: 'baja' },
      { semana: 2, duracionMinutos: 15, intensidad: 'media' },
      { semana: 3, duracionMinutos: 20, intensidad: 'media' },
      { semana: 4, duracionMinutos: 25, intensidad: 'alta' },
    ]

    const nuevaRutina = await UsuarioRutina.create({
      usuario: usuarioId,
      tipo: 'personalizada',
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
