// controllers/posturaController.js
import Postura from '../models/postura.js'
import { AppError } from '../utils/errorHandler.js'

// Crear postura
export const crearPostura = async (req, res, next) => {
  try {
    const nueva = await Postura.create(req.body)

    res.status(201).json({
      status: 'success',
      msg: 'Postura creada correctamente',
      data: nueva,
    })
  } catch (error) {
    next(error)
  }
}

// Obtener todas las posturas
export const obtenerPosturas = async (req, res, next) => {
  try {
    const posturas = await Postura.find()

    res.status(200).json({
      status: 'success',
      data: posturas,
    })
  } catch (error) {
    next(error)
  }
}

// Obtener postura por ID
export const obtenerPostura = async (req, res, next) => {
  try {
    const postura = await Postura.findById(req.params.id)

    if (!postura) {
      return next(new AppError('Postura no encontrada', 404))
    }

    res.status(200).json({
      status: 'success',
      data: postura,
    })
  } catch (error) {
    next(error)
  }
}

// Actualizar postura
export const actualizarPostura = async (req, res, next) => {
  try {
    const postura = await Postura.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    if (!postura) {
      return next(new AppError('No se pudo actualizar: no existe', 404))
    }

    res.status(200).json({
      status: 'success',
      msg: 'Postura actualizada',
      data: postura,
    })
  } catch (error) {
    next(error)
  }
}

// Eliminar postura
export const eliminarPostura = async (req, res, next) => {
  try {
    const postura = await Postura.findByIdAndDelete(req.params.id)

    if (!postura) {
      return next(new AppError('No se pudo eliminar: no existe', 404))
    }

    res.status(200).json({
      status: 'success',
      msg: 'Postura eliminada',
    })
  } catch (error) {
    next(error)
  }
}
