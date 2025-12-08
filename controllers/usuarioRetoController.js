import UsuarioReto from '../models/usuarioReto.js'
import Reto from '../models/reto.js'

export const iniciarReto = async (req, res) => {
  try {
    const usuarioId = req.usuario.id
    const { retoId } = req.body

    // Verificar que el reto existe
    const reto = await Reto.findById(retoId)
    if (!reto) return res.status(404).json({ message: 'Reto no encontrado' })

    // Verificar si el usuario ya tiene un progreso previo
    let progreso = await UsuarioReto.findOne({
      usuario: usuarioId,
      reto: retoId,
    })

    if (!progreso) {
      progreso = await UsuarioReto.create({
        usuario: usuarioId,
        reto: retoId,
        fechaInicio: new Date(),
        estado: 'en_progreso',
      })
    }

    res.status(201).json(progreso)
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar reto', error })
  }
}

export const completarPostura = async (req, res) => {
  try {
    const usuarioId = req.usuario.id
    const { retoId, posturaId } = req.body

    const progreso = await UsuarioReto.findOne({
      usuario: usuarioId,
      reto: retoId,
    })

    if (!progreso)
      return res.status(404).json({ message: 'No has iniciado este reto' })

    if (progreso.posturasCompletadas.includes(posturaId)) {
      return res.status(400).json({ message: 'Ya completaste esta postura' })
    }

    progreso.posturasCompletadas.push(posturaId)
    await progreso.save()

    res.status(200).json(progreso)
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar postura', error })
  }
}

export const completarReto = async (req, res) => {
  try {
    const usuarioId = req.usuario.id
    const { retoId } = req.body

    const progreso = await UsuarioReto.findOne({
      usuario: usuarioId,
      reto: retoId,
    }).populate('reto')

    if (!progreso)
      return res
        .status(404)
        .json({ message: 'No estás participando en este reto' })

    progreso.estado = 'completado'
    progreso.fechaFin = new Date()

    // Tiempo total
    if (progreso.fechaInicio) {
      const diffMs = progreso.fechaFin - progreso.fechaInicio
      progreso.tiempoTotalMin = Math.round(diffMs / 60000)
    }

    await progreso.save()

    res.status(200).json({
      message: 'Reto completado. Puedes reclamar tu recompensa.',
      progreso,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al completar reto', error })
  }
}

export const obtenerMisRetos = async (req, res) => {
  try {
    const usuarioId = req.usuario.id

    const retos = await UsuarioReto.find({ usuario: usuarioId })
      .populate('reto')
      .populate('posturasCompletadas')

    res.status(200).json(retos)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener retos', error })
  }
}
