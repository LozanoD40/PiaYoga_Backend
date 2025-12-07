import Consejo from '../models/consejos.js'
import { AppError } from '../utils/errorHandler.js'

// Crear un consejo
export const crearConsejo = async (req, res, next) => {
  try {
    const { texto, categoria } = req.body
    const imagen = req.file ? req.file.path : null

    if (!texto)
      return next(new AppError('El texto del consejo es obligatorio', 400))

    const nuevo = await Consejo.create({
      texto,
      categoria,
      imagen,
    })

    res.status(201).json({
      status: 'success',
      data: nuevo,
    })
  } catch (error) {
    next(error)
  }
}

// Listar todos
export const listarConsejos = async (req, res, next) => {
  try {
    const consejos = await Consejo.find().sort({ creadoEn: -1 })

    res.status(200).json({
      status: 'success',
      data: consejos,
    })
  } catch (error) {
    next(error)
  }
}

// Obtener uno
export const obtenerConsejo = async (req, res, next) => {
  try {
    const consejo = await Consejo.findById(req.params.id)

    if (!consejo) return next(new AppError('Consejo no encontrado', 404))

    res.status(200).json({
      status: 'success',
      data: consejo,
    })
  } catch (error) {
    next(error)
  }
}

// Actualizar
export const actualizarConsejo = async (req, res, next) => {
  try {
    const datos = req.body

    if (req.file) datos.imagen = req.file.path

    const consejo = await Consejo.findByIdAndUpdate(req.params.id, datos, {
      new: true,
      runValidators: true,
    })

    if (!consejo) return next(new AppError('Consejo no encontrado', 404))

    res.status(200).json({
      status: 'success',
      data: consejo,
    })
  } catch (error) {
    next(error)
  }
}

// Eliminar
export const eliminarConsejo = async (req, res, next) => {
  try {
    const consejo = await Consejo.findByIdAndDelete(req.params.id)

    if (!consejo) return next(new AppError('Consejo no encontrado', 404))

    res.status(200).json({
      status: 'success',
      msg: 'Consejo eliminado',
    })
  } catch (error) {
    next(error)
  }
}

// Activar / Desactivar
export const cambiarEstadoConsejo = async (req, res, next) => {
  try {
    const consejo = await Consejo.findById(req.params.id)

    if (!consejo) return next(new AppError('Consejo no encontrado', 404))

    consejo.activo = !consejo.activo
    await consejo.save()

    res.status(200).json({
      status: 'success',
      msg: `Consejo ahora está ${consejo.activo ? 'activo' : 'inactivo'}`,
      data: consejo,
    })
  } catch (error) {
    next(error)
  }
}
