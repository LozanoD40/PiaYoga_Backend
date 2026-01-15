import Logro from '../models/logro.js'
import { AppError } from '../utils/errorHandler.js'

/* ======================================
   Crear logro (solo admin)
====================================== */
export const crearLogro = async (req, res, next) => {
  try {
    const { nombre, frase, imagen, rareza, tipo, requisitos } = req.body

    if (!nombre || !frase || !imagen) {
      return next(new AppError('Nombre, frase e imagen son obligatorios', 400))
    }

    const logroExistente = await Logro.findOne({ nombre })
    if (logroExistente) {
      return next(new AppError('Ya existe un logro con ese nombre', 400))
    }

    const nuevoLogro = await Logro.create({
      nombre,
      frase,
      imagen,
      rareza,
      tipo,
      requisitos,
      estado: 'publicado',
    })

    res.status(201).json({
      status: 'success',
      msg: 'Logro creado correctamente',
      data: nuevoLogro,
    })
  } catch (error) {
    next(error)
  }
}

/* ======================================
   Obtener todos los logros publicados
====================================== */
export const obtenerLogros = async (req, res, next) => {
  try {
    const logros = await Logro.find({ estado: 'publicado' })

    res.status(200).json({
      status: 'success',
      results: logros.length,
      data: logros,
    })
  } catch (error) {
    next(error)
  }
}

/* ======================================
   Obtener logro por ID
====================================== */
export const obtenerLogro = async (req, res, next) => {
  try {
    const { id } = req.params

    const logro = await Logro.findById(id)

    if (!logro) {
      return next(new AppError('Logro no encontrado', 404))
    }

    res.status(200).json({
      status: 'success',
      data: logro,
    })
  } catch (error) {
    next(error)
  }
}

/* ======================================
   Obtener logros por tipo
====================================== */
export const obtenerLogrosPorTipo = async (req, res, next) => {
  try {
    const { tipo } = req.params

    const logros = await Logro.find({
      tipo,
      estado: 'publicado',
    })

    if (!logros.length) {
      return next(new AppError('No hay logros disponibles para este tipo', 404))
    }

    res.status(200).json({
      status: 'success',
      results: logros.length,
      data: logros,
    })
  } catch (error) {
    next(error)
  }
}

/* ======================================
   Actualizar logro (solo admin)
====================================== */
export const actualizarLogro = async (req, res, next) => {
  try {
    const { id } = req.params

    const logroActualizado = await Logro.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!logroActualizado) {
      return next(new AppError('Logro no encontrado', 404))
    }

    res.status(200).json({
      status: 'success',
      msg: 'Logro actualizado correctamente',
      data: logroActualizado,
    })
  } catch (error) {
    next(error)
  }
}

/* ======================================
   Eliminar logro (solo admin)
====================================== */
export const eliminarLogro = async (req, res, next) => {
  try {
    const { id } = req.params

    const logroEliminado = await Logro.findByIdAndDelete(id)

    if (!logroEliminado) {
      return next(new AppError('Logro no encontrado', 404))
    }

    res.status(200).json({
      status: 'success',
      msg: 'Logro eliminado correctamente',
    })
  } catch (error) {
    next(error)
  }
}
