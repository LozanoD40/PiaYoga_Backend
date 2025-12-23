import Rutina from '../models/rutina.js'
import Postura from '../models/postura.js'

export const crearRutina = async (req, res) => {
  try {
    const { nombre, tipo, descripcion, posturas } = req.body

    if (!nombre || !tipo || !posturas || posturas.length === 0) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' })
    }

    // Validación tipo
    if (!['predefinido', 'personalizado'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo inválido' })
    }

    // Si es predefinido, solo admin
    if (tipo === 'predefinido' && req.user.rol !== 'admin') {
      return res
        .status(403)
        .json({
          error: 'Solo administradores pueden crear rutinas predefinidas',
        })
    }

    // ============================
    // Obtener posturas desde DB
    // ============================
    const posturasDB = await Postura.find({ _id: { $in: posturas } })

    if (posturasDB.length !== posturas.length) {
      return res.status(404).json({ error: 'Una o más posturas no existen' })
    }

    // ============================
    // Calcular energía, tiempo, dificultad
    // ============================
    const energiaTotal = posturasDB.reduce((acc, p) => acc + p.energia, 0)
    const tiempoTotal = posturasDB.reduce((acc, p) => acc + p.tiempo, 0)
    const dificultadPromedio =
      posturasDB.reduce((acc, p) => acc + p.dificultad, 0) / posturasDB.length

    // ============================
    // Crear Rutina
    // ============================
    const nuevaRutina = await Rutina.create({
      nombre,
      tipo,
      descripcion,
      posturas,
      energiaTotal,
      tiempoTotal,
      dificultadPromedio,
      estado: 'publicado',
    })

    res.status(201).json({
      msg: 'Rutina creada correctamente',
      rutina: nuevaRutina,
    })
  } catch (err) {
    console.error('Error creando rutina:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

/* ===============================
   Obtener todas las rutinas
=================================*/
export const obtenerRutinas = async (req, res) => {
  try {
    const rutinas = await Rutina.find().populate('posturas')

    res.json(rutinas)
  } catch (err) {
    console.error('Error obteniendo rutinas:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

/* ===============================
   Obtener rutina por ID
=================================*/
export const obtenerRutinaPorId = async (req, res) => {
  try {
    const { id } = req.params

    const rutina = await Rutina.findById(id).populate('posturas')

    if (!rutina) {
      return res.status(404).json({ error: 'Rutina no encontrada' })
    }

    res.json(rutina)
  } catch (err) {
    console.error('Error obteniendo rutina:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

/* ===============================
   Actualizar rutina (solo admin)
=================================*/
export const actualizarRutina = async (req, res) => {
  try {
    const { id } = req.params

    if (req.user.rol !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Solo administradores pueden editar rutinas' })
    }

    const { nombre, descripcion, posturas, estado } = req.body

    // Si hay posturas nuevas, recalcular
    let recalculo = {}
    if (posturas) {
      const posturasDB = await Postura.find({ _id: { $in: posturas } })

      if (posturasDB.length !== posturas.length) {
        return res.status(404).json({ error: 'Una o más posturas no existen' })
      }

      recalculo.energiaTotal = posturasDB.reduce((acc, p) => acc + p.energia, 0)
      recalculo.tiempoTotal = posturasDB.reduce((acc, p) => acc + p.tiempo, 0)
      recalculo.dificultadPromedio =
        posturasDB.reduce((acc, p) => acc + p.dificultad, 0) / posturasDB.length
    }

    const rutinaActualizada = await Rutina.findByIdAndUpdate(
      id,
      { nombre, descripcion, posturas, estado, ...recalculo },
      { new: true }
    )

    if (!rutinaActualizada) {
      return res.status(404).json({ error: 'Rutina no encontrada' })
    }

    res.json({
      msg: 'Rutina actualizada correctamente',
      rutina: rutinaActualizada,
    })
  } catch (err) {
    console.error('Error actualizando rutina:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

/* ===============================
   Eliminar rutina (solo admin)
=================================*/
export const eliminarRutina = async (req, res) => {
  try {
    const { id } = req.params

    if (req.user.rol !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Solo administradores pueden eliminar rutinas' })
    }

    const rutina = await Rutina.findByIdAndDelete(id)

    if (!rutina) {
      return res.status(404).json({ error: 'Rutina no encontrada' })
    }

    res.json({ msg: 'Rutina eliminada correctamente' })
  } catch (err) {
    console.error('Error eliminando rutina:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
