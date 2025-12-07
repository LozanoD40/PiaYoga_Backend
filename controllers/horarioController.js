import Horario from '../models/horario.js'
import { createError } from '../utils/errorHandler.js'

// Crear horario (solo admin)
export const crearHorario = async (req, res, next) => {
  try {
    const horario = new Horario(req.body)
    await horario.save()
    res.status(201).json({ mensaje: 'Horario creado', horario })
  } catch (error) {
    next(error)
  }
}

// Listar horarios disponibles (usuario y admin)
export const listarHorarios = async (req, res, next) => {
  try {
    const horarios = await Horario.find({ estado: true })
    res.json(horarios)
  } catch (error) {
    next(error)
  }
}

// Editar horario (solo admin)
export const editarHorario = async (req, res, next) => {
  try {
    const horario = await Horario.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    res.json({ mensaje: 'Horario actualizado', horario })
  } catch (error) {
    next(error)
  }
}

// Eliminar horario (solo admin)
export const eliminarHorario = async (req, res, next) => {
  try {
    await Horario.findByIdAndDelete(req.params.id)
    res.json({ mensaje: 'Horario eliminado' })
  } catch (error) {
    next(error)
  }
}
