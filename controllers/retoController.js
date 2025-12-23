import Reto from '../models/reto.js'
import Rutina from '../models/rutina.js'
import Accesorio from '../models/accesorio.js'
import { AppError } from '../utils/errorHandler.js'

// Crear un nuevo reto
export const crearReto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      rutina,
      recompensaOro,
      recompensaAccesorio,
      fechaInicio,
      fechaFin,
      estado,
    } = req.body

    // Verificar que la rutina exista
    const rutinaExistente = await Rutina.findById(rutina)
    if (!rutinaExistente) {
      throw new ErrorResponse('La rutina no existe', 404)
    }

    // Si incluye accesorio validar que exista
    if (recompensaAccesorio) {
      const acc = await Accesorio.findById(recompensaAccesorio)
      if (!acc) throw new ErrorResponse('Accesorio inválido', 400)
    }

    // Validar fechas
    if (
      fechaInicio &&
      fechaFin &&
      new Date(fechaInicio) >= new Date(fechaFin)
    ) {
      throw new ErrorResponse(
        'La fecha de inicio debe ser menor que la fecha fin',
        400
      )
    }

    const reto = await Reto.create({
      nombre,
      descripcion,
      rutina,
      recompensaOro,
      recompensaAccesorio,
      fechaInicio,
      fechaFin,
      estado,
    })

    res.status(201).json({ mensaje: 'Reto creado', reto })
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}

// Obtener todos los retos
export const listarRetos = async (req, res) => {
  try {
    const retos = await Reto.find()
      .populate('rutina')
      .populate('recompensaAccesorio')

    res.json(retos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Obtener retos activos
export const listarRetosActivos = async (req, res) => {
  try {
    const retos = await Reto.find({ estado: 'activo' })
      .populate('rutina')
      .populate('recompensaAccesorio')

    res.json(retos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Obtener retos por rutina
export const retosPorRutina = async (req, res) => {
  try {
    const { rutinaId } = req.params

    const retos = await Reto.find({ rutina: rutinaId }).populate(
      'recompensaAccesorio'
    )

    res.json(retos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Obtener un reto por ID
export const obtenerReto = async (req, res) => {
  try {
    const reto = await Reto.findById(req.params.id)
      .populate('rutina')
      .populate('recompensaAccesorio')

    if (!reto) {
      throw new ErrorResponse('Reto no encontrado', 404)
    }

    res.json(reto)
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}

// Actualizar un reto
export const actualizarReto = async (req, res) => {
  try {
    const datos = req.body

    // Validación de accesorio si viene incluido
    if (datos.recompensaAccesorio) {
      const acc = await Accesorio.findById(datos.recompensaAccesorio)
      if (!acc) throw new ErrorResponse('Accesorio inválido', 400)
    }

    // Validación de fechas
    if (datos.fechaInicio && datos.fechaFin) {
      if (new Date(datos.fechaInicio) >= new Date(datos.fechaFin)) {
        throw new ErrorResponse('Fecha inicio debe ser < fecha fin', 400)
      }
    }

    const reto = await Reto.findByIdAndUpdate(req.params.id, datos, {
      new: true,
      runValidators: true,
    })

    if (!reto) throw new ErrorResponse('Reto no encontrado', 404)

    res.json({ mensaje: 'Reto actualizado', reto })
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}

// Cambiar estado del reto
export const cambiarEstadoReto = async (req, res) => {
  try {
    const { estado } = req.body

    if (!['activo', 'oculto', 'finalizado'].includes(estado)) {
      throw new ErrorResponse('Estado inválido', 400)
    }

    const reto = await Reto.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    )

    if (!reto) throw new ErrorResponse('Reto no encontrado', 404)

    res.json({ mensaje: 'Estado actualizado', reto })
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}

// Eliminar reto
export const eliminarReto = async (req, res) => {
  try {
    const reto = await Reto.findByIdAndDelete(req.params.id)

    if (!reto) throw new ErrorResponse('Reto no encontrado', 404)

    res.json({ mensaje: 'Reto eliminado' })
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}
