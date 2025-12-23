import UsuarioReto from '../models/usuarioReto.js'
import Reto from '../models/reto.js'
import Postura from '../models/postura.js'

/* 🟦 Crear registro de un usuario en un reto */
export const asignarRetoAUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario._id
    const { retoId } = req.body

    // Verifica que el reto exista
    const reto = await Reto.findById(retoId)
    if (!reto) return res.status(404).json({ msg: 'Reto no encontrado' })

    // Evitar duplicados (si aplicas unique)
    const existe = await UsuarioReto.findOne({
      usuario: usuarioId,
      reto: retoId,
    })
    if (existe)
      return res.status(400).json({ msg: 'Ya estás inscrito a este reto' })

    const nuevo = await UsuarioReto.create({
      usuario: usuarioId,
      reto: retoId,
      estado: 'en_progreso',
      fechaInicio: new Date(),
    })

    res.json(nuevo)
  } catch (error) {
    res.status(500).json({ msg: 'Error al asignar reto', error })
  }
}

/* 🟦 Obtener mis retos */
export const obtenerMisRetos = async (req, res) => {
  try {
    const usuarioId = req.usuario._id

    const retos = await UsuarioReto.find({ usuario: usuarioId })
      .populate('reto')
      .populate('posturasCompletadas')

    res.json(retos)
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener retos', error })
  }
}

/* 🟦 Marcar postura como completada */
export const completarPostura = async (req, res) => {
  try {
    const usuarioId = req.usuario._id
    const { usuarioRetoId, posturaId } = req.body

    const registro = await UsuarioReto.findOne({
      _id: usuarioRetoId,
      usuario: usuarioId,
    })

    if (!registro)
      return res.status(404).json({ msg: 'Registro no encontrado' })

    if (registro.posturasCompletadas.includes(posturaId))
      return res.status(400).json({ msg: 'Postura ya completada' })

    registro.posturasCompletadas.push(posturaId)
    await registro.save()

    res.json(registro)
  } catch (error) {
    res.status(500).json({ msg: 'Error al completar postura', error })
  }
}

/* 🟦 Finalizar reto */
export const finalizarReto = async (req, res) => {
  try {
    const usuarioId = req.usuario._id
    const { usuarioRetoId } = req.body

    const registro = await UsuarioReto.findOne({
      _id: usuarioRetoId,
      usuario: usuarioId,
    }).populate('reto')

    if (!registro)
      return res.status(404).json({ msg: 'Registro no encontrado' })

    registro.estado = 'completado'
    registro.fechaFin = new Date()
    registro.tiempoTotalMin =
      (registro.fechaFin - registro.fechaInicio) / 1000 / 60

    await registro.save()

    res.json({ msg: 'Reto completado', registro })
  } catch (error) {
    res.status(500).json({ msg: 'Error al completar reto', error })
  }
}

/* 🟦 Eliminar participación en un reto */
export const eliminarUsuarioReto = async (req, res) => {
  try {
    await UsuarioReto.findByIdAndDelete(req.params.id)
    res.json({ msg: 'Registro eliminado' })
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar', error })
  }
}
