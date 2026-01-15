import Rutina from '../models/rutina.js'
import Postura from '../models/postura.js'

export const crearRutina = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      imagen,
      dificultad,
      tiempoTotal,
      posturas,
      musica,
    } = req.body

    if (
      !nombre ||
      !imagen ||
      !dificultad ||
      !tiempoTotal ||
      !posturas ||
      posturas.length === 0
    ) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' })
    }

    // ============================
    // Validar posturas
    // ============================
    const idsPosturas = posturas.map((p) => p.postura)

    const posturasDB = await Postura.find({ _id: { $in: idsPosturas } })

    if (posturasDB.length !== idsPosturas.length) {
      return res.status(404).json({
        error: 'Una o más posturas no existen',
      })
    }

    // ============================
    // Crear rutina (FORZADA)
    // ============================
    const dataRutina = {
      nombre,
      tipo: 'predefinido', // 👈 SIEMPRE
      descripcion,
      imagen,
      dificultad,
      tiempoTotal,
      posturas,
      musica,
      estado: 'publicado',
      // ❌ sin creador
    }

    const nuevaRutina = await Rutina.create(dataRutina)

    res.status(201).json({
      msg: 'Rutina creada correctamente (modo prueba)',
      rutina: nuevaRutina,
    })
  } catch (err) {
    console.error('Error creando rutina:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const obtenerRutinas = async (req, res) => {
  try {
    const filtro = {
      estado: 'publicado',
      $or: [
        { tipo: 'predefinido' },
        ...(req.user ? [{ tipo: 'personalizado', creador: req.user.id }] : []),
      ],
    }

    const rutinas = await Rutina.find(filtro).populate('posturas.postura')

    res.status(200).json({
      status: 'success',
      rutinas,
    })
  } catch (err) {
    console.error('Error obteniendo rutinas:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const obtenerRutinaPorId = async (req, res) => {
  try {
    const { id } = req.params

    const rutina = await Rutina.findById(id)
      .populate('posturas.postura')
      .populate('musica')

    if (!rutina) {
      return res.status(404).json({ error: 'Rutina no encontrada' })
    }

    res.json(rutina)
  } catch (err) {
    console.error('Error obteniendo rutina:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const actualizarRutina = async (req, res) => {
  try {
    const { id } = req.params

    if (req.user.rol !== 'admin') {
      return res.status(403).json({
        error: 'Solo administradores pueden editar rutinas',
      })
    }

    const {
      nombre,
      descripcion,
      imagen,
      dificultad,
      tiempoTotal,
      posturas,
      musica,
      estado,
    } = req.body

    // Validar posturas si vienen
    if (posturas) {
      const idsPosturas = posturas.map((p) => p.postura)
      const posturasDB = await Postura.find({ _id: { $in: idsPosturas } })

      if (posturasDB.length !== idsPosturas.length) {
        return res.status(404).json({
          error: 'Una o más posturas no existen',
        })
      }
    }

    const rutinaActualizada = await Rutina.findByIdAndUpdate(
      id,
      {
        nombre,
        descripcion,
        imagen,
        dificultad,
        tiempoTotal,
        posturas,
        musica,
        estado,
      },
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

export const eliminarRutina = async (req, res) => {
  try {
    const { id } = req.params

    if (req.user.rol !== 'admin') {
      return res.status(403).json({
        error: 'Solo administradores pueden eliminar rutinas',
      })
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
