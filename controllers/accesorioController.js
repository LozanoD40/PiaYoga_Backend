import Accesorio from '../models/accesorio.js'
import { AppError } from '../utils/errorHandler.js'

// Crear accesorio (solo admin)
export const crearAccesorio = async (req, res, next) => {
  try {
    const {
      nombre,
      categoria,
      descripcion,
      rareza,
      precio,
      imagen,
      requisitos,
    } = req.body

    if (!nombre || !categoria) {
      return next(new AppError('Nombre y categoría son obligatorios', 400))
    }

    const nuevoAccesorio = await Accesorio.create({
      nombre,
      categoria,
      descripcion,
      rareza,
      precio,
      imagen,
      requisitos,
    })

    res.status(201).json({
      status: 'success',
      msg: 'Accesorio creado correctamente',
      data: nuevoAccesorio,
    })
  } catch (error) {
    next(error)
  }
}

// Obtener todos los accesorios
export const obtenerAccesorios = async (req, res, next) => {
  try {
    const accesorios = await Accesorio.find()
    res.status(200).json({
      status: 'success',
      results: accesorios.length,
      data: accesorios,
    })
  } catch (error) {
    next(error)
  }
}

// Obtener accesorios por categoría
export const obtenerPorCategoria = async (req, res, next) => {
  try {
    const { categoria } = req.params

    const accesorios = await Accesorio.find({ categoria })

    if (!accesorios.length) {
      return next(new AppError('No hay accesorios en esta categoría', 404))
    }

    res.status(200).json({
      status: 'success',
      results: accesorios.length,
      data: accesorios,
    })
  } catch (error) {
    next(error)
  }
}

// Obtener un accesorio por ID
export const obtenerAccesorio = async (req, res, next) => {
  try {
    const { id } = req.params
    const accesorio = await Accesorio.findById(id)

    if (!accesorio) {
      return next(new AppError('Accesorio no encontrado', 404))
    }

    res.status(200).json({
      status: 'success',
      data: accesorio,
    })
  } catch (error) {
    next(error)
  }
}

// Actualizar accesorio
export const actualizarAccesorio = async (req, res, next) => {
  try {
    const { id } = req.params

    const accesorioActualizado = await Accesorio.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!accesorioActualizado) {
      return next(new AppError('No se encontró el accesorio a modificar', 404))
    }

    res.status(200).json({
      status: 'success',
      msg: 'Accesorio actualizado correctamente',
      data: accesorioActualizado,
    })
  } catch (error) {
    next(error)
  }
}

// Eliminar accesorio
export const eliminarAccesorio = async (req, res, next) => {
  try {
    const { id } = req.params
    const accesorioEliminado = await Accesorio.findByIdAndDelete(id)

    if (!accesorioEliminado) {
      return next(new AppError('Accesorio no encontrado', 404))
    }

    res.status(200).json({
      status: 'success',
      msg: 'Accesorio eliminado correctamente',
    })
  } catch (error) {
    next(error)
  }
}
