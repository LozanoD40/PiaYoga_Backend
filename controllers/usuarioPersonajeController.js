import UsuarioPersonaje from '../models/usuarioPersonaje.js'
import UsuarioInventario from '../models/usuarioInventario.js'
import Accesorio from '../models/accesorio.js'
import { AppError } from '../utils/errorHandler.js'

// Obtener personaje del usuario autenticado
export const obtenerMiPersonaje = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id

    const personaje = await UsuarioPersonaje.findOne({ usuario: usuarioId })
      .populate('personaje')
      .populate('sombrero')
      .populate('banda')
      .populate('tapete')
      .populate('ropa')
      .populate('fondo')

    if (!personaje) {
      return next(new AppError('El usuario no tiene personaje aún', 404))
    }

    res.status(200).json({
      status: 'success',
      data: personaje,
    })
  } catch (error) {
    next(error)
  }
}

// Crear personaje inicial
export const crearPersonajeInicial = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id

    const existe = await UsuarioPersonaje.findOne({ usuario: usuarioId })
    if (existe) {
      return next(new AppError('El usuario ya tiene un personaje', 400))
    }

    const personaje = await UsuarioPersonaje.create({
      usuario: usuarioId,
    })

    res.status(201).json({
      status: 'success',
      msg: 'Personaje creado correctamente',
      data: personaje,
    })
  } catch (error) {
    next(error)
  }
}

// Equipar accesorio a un slot
export const equiparAccesorio = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id
    const { accesorioId, slot } = req.body

    if (!accesorioId || !slot) {
      return next(new AppError('Debes enviar accesorioId y slot', 400))
    }

    const slotsValidos = [
      'personaje',
      'sombrero',
      'banda',
      'tapete',
      'ropa',
      'fondo',
    ]
    if (!slotsValidos.includes(slot)) {
      return next(new AppError('Slot inválido', 400))
    }

    const personaje = await UsuarioPersonaje.findOne({ usuario: usuarioId })
    if (!personaje) {
      return next(new AppError('Crea tu personaje primero', 404))
    }

    // Validar accesorio
    const accesorioExiste = await Accesorio.findById(accesorioId)
    if (!accesorioExiste) {
      return next(new AppError('El accesorio no existe', 404))
    }

    // ❗ Nueva validación: tipo debe coincidir con el slot
    if (accesorioExiste.tipo !== slot) {
      return next(
        new AppError(
          `Este accesorio es de tipo ${accesorioExiste.tipo} y no puede equiparse en el slot ${slot}`,
          400
        )
      )
    }

    // Validar inventario
    const inventario = await UsuarioInventario.findOne({ usuario: usuarioId })
    if (!inventario || !inventario.accesorios.includes(accesorioId)) {
      return next(
        new AppError('No tienes este accesorio en tu inventario', 403)
      )
    }

    // ❗ Solo puede haber uno por slot, así que simplemente reemplaza
    personaje[slot] = accesorioId
    await personaje.save()

    res.status(200).json({
      status: 'success',
      msg: `Accesorio equipado en ${slot}`,
      data: personaje,
    })
  } catch (error) {
    next(error)
  }
}

// Quitar un accesorio de un slot
export const resetSlot = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id
    const { slot } = req.body

    const slotsValidos = [
      'personaje',
      'sombrero',
      'banda',
      'tapete',
      'ropa',
      'fondo',
    ]
    if (!slotsValidos.includes(slot)) {
      return next(new AppError('Slot inválido', 400))
    }

    const personaje = await UsuarioPersonaje.findOne({ usuario: usuarioId })
    if (!personaje) {
      return next(new AppError('Crea tu personaje primero', 404))
    }

    personaje[slot] = null
    await personaje.save()

    res.status(200).json({
      status: 'success',
      msg: `Slot ${slot} reseteado`,
      data: personaje,
    })
  } catch (error) {
    next(error)
  }
}

// Quitar todo lo equipado
export const resetTodo = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id

    const personaje = await UsuarioPersonaje.findOne({ usuario: usuarioId })
    if (!personaje) {
      return next(new AppError('Crea tu personaje primero', 404))
    }

    personaje.personaje = null
    personaje.sombrero = null
    personaje.banda = null
    personaje.tapete = null
    personaje.ropa = null
    personaje.fondo = null

    await personaje.save()

    res.status(200).json({
      status: 'success',
      msg: 'Todos los accesorios fueron removidos',
      data: personaje,
    })
  } catch (error) {
    next(error)
  }
}
