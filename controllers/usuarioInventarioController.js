import UsuarioInventario from '../models/usuarioInventario.js'
import Accesorio from '../models/accesorio.js'
import { AppError } from '../utils/errorHandler.js'

// Obtener inventario del usuario autenticado
export const obtenerMiInventario = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id

    const inventario = await UsuarioInventario.findOne({
      usuario: usuarioId,
    }).populate('accesorios')

    if (!inventario) {
      return next(new AppError('El usuario no tiene inventario aún', 404))
    }

    res.status(200).json({
      status: 'success',
      data: inventario,
    })
  } catch (error) {
    next(error)
  }
}

// Crear inventario inicial del usuario (solo 1 vez)
export const crearInventario = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id

    const existe = await UsuarioInventario.findOne({ usuario: usuarioId })
    if (existe) {
      return next(new AppError('El usuario ya tiene un inventario', 400))
    }

    const nuevo = await UsuarioInventario.create({
      usuario: usuarioId,
      accesorios: [],
    })

    res.status(201).json({
      status: 'success',
      msg: 'Inventario creado correctamente',
      data: nuevo,
    })
  } catch (error) {
    next(error)
  }
}

// Agregar accesorio al inventario
export const agregarAccesorio = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id
    const { accesorioId } = req.body

    if (!accesorioId) {
      return next(new AppError('Debes enviar el ID del accesorio', 400))
    }

    const accesorioExiste = await Accesorio.findById(accesorioId)
    if (!accesorioExiste) {
      return next(new AppError('El accesorio no existe', 404))
    }

    const inventario = await UsuarioInventario.findOne({ usuario: usuarioId })

    if (!inventario) {
      return next(
        new AppError('Inventario no encontrado. Crea uno primero', 404)
      )
    }

    if (inventario.accesorios.includes(accesorioId)) {
      return next(new AppError('Este accesorio ya está en tu inventario', 400))
    }

    inventario.accesorios.push(accesorioId)
    await inventario.save()

    res.status(200).json({
      status: 'success',
      msg: 'Accesorio agregado al inventario',
      data: inventario,
    })
  } catch (error) {
    next(error)
  }
}

// Eliminar accesorio del inventario
export const removerAccesorio = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id
    const { accesorioId } = req.body

    const inventario = await UsuarioInventario.findOne({ usuario: usuarioId })

    if (!inventario) {
      return next(new AppError('Inventario no encontrado', 404))
    }

    const existe = inventario.accesorios.includes(accesorioId)
    if (!existe) {
      return next(new AppError('Este accesorio no está en tu inventario', 400))
    }

    inventario.accesorios = inventario.accesorios.filter(
      (item) => item.toString() !== accesorioId
    )

    await inventario.save()

    res.status(200).json({
      status: 'success',
      msg: 'Accesorio removido del inventario',
      data: inventario,
    })
  } catch (error) {
    next(error)
  }
}
