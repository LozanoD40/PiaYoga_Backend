import UsuarioHorario from '../models/usuarioHorario.js'
import { createError } from '../utils/errorHandler.js'

export const guardarHorario = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id
    const { dias, horaInicio, horaFin, zonaHoraria } = req.body

    // Verificar que exista un horario oficial coincidente
    const horarioValido = await Horario.findOne({
      dias: { $all: dias },
      horaInicio,
      horaFin,
      estado: true,
    })

    if (!horarioValido) {
      return next(createError(400, 'El horario no existe en la lista oficial'))
    }

    const horarioActualizado = await UsuarioHorario.findOneAndUpdate(
      { usuario: usuarioId },
      { dias, horaInicio, horaFin, zonaHoraria },
      { new: true, upsert: true }
    )

    res.status(200).json({
      mensaje: 'Horario guardado correctamente',
      horario: horarioActualizado,
    })
  } catch (error) {
    next(error)
  }
}

export const obtenerHorario = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id

    const horario = await UsuarioHorario.findOne({ usuario: usuarioId })

    if (!horario) {
      return next(createError(404, 'No tienes horario configurado'))
    }

    res.status(200).json(horario)
  } catch (error) {
    next(error)
  }
}

export const cambiarEstadoHorario = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id
    const { estado } = req.body

    if (!['activo', 'pausado'].includes(estado)) {
      return next(createError(400, 'Estado inválido'))
    }

    const horario = await UsuarioHorario.findOneAndUpdate(
      { usuario: usuarioId },
      { estado },
      { new: true }
    )

    res.status(200).json({
      mensaje: `Horario ${estado}`,
      horario,
    })
  } catch (error) {
    next(error)
  }
}
