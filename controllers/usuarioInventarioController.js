import UsuarioInventario from '../models/usuarioInventario.js'
import Logro from '../models/logro.js'
import { AppError } from '../utils/errorHandler.js'

/* ======================================
   Obtener inventario / perfil del usuario
====================================== */
export const obtenerMiInventario = async (req, res, next) => {
  try {
    const usuarioId = req.user.id

    const inventario = await UsuarioInventario.findOne({
      usuario: usuarioId,
    }).populate('logros.logro')

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

/* ======================================
   Crear inventario inicial (una sola vez)
====================================== */
export const crearInventario = async (req, res, next) => {
  try {
    const usuarioId = req.user.id

    const existe = await UsuarioInventario.findOne({ usuario: usuarioId })
    if (existe) {
      return next(new AppError('El usuario ya tiene un inventario', 400))
    }

    const nuevoInventario = await UsuarioInventario.create({
      usuario: usuarioId,
      perfil: {},
      logros: [],
    })

    res.status(201).json({
      status: 'success',
      msg: 'Inventario creado correctamente',
      data: nuevoInventario,
    })
  } catch (error) {
    next(error)
  }
}

/* ======================================
   Actualizar datos personales del perfil
====================================== */
export const Perfil = async (req, res, next) => {
  try {
    const usuarioId = req.user.id
    const { pesoKg, alturaCm, edad, estiloVida } = req.body

    const inventario = await UsuarioInventario.findOne({ usuario: usuarioId })

    if (!inventario) {
      return next(new AppError('Inventario no encontrado', 404))
    }

    inventario.perfil = {
      ...inventario.perfil,
      pesoKg,
      alturaCm,
      edad,
      estiloVida,
    }

    await inventario.save()

    res.status(200).json({
      status: 'success',
      msg: 'Perfil actualizado correctamente',
      data: inventario.perfil,
    })
  } catch (error) {
    next(error)
  }
}

/* ======================================
   Desbloquear logro manualmente (admin o sistema)
====================================== */
export const agregarLogro = async (req, res, next) => {
  try {
    const usuarioId = req.user.id
    const { logroId, motivo } = req.body

    if (!logroId) {
      return next(new AppError('Debes enviar el ID del logro', 400))
    }

    const logro = await Logro.findById(logroId)
    if (!logro) {
      return next(new AppError('El logro no existe', 404))
    }

    const inventario = await UsuarioInventario.findOne({ usuario: usuarioId })

    if (!inventario) {
      return next(new AppError('Inventario no encontrado', 404))
    }

    const yaDesbloqueado = inventario.logros.some(
      (l) => l.logro.toString() === logroId
    )

    if (yaDesbloqueado) {
      return next(new AppError('Este logro ya fue desbloqueado', 400))
    }

    inventario.logros.push({
      logro: logroId,
      motivo,
    })

    await inventario.save()

    res.status(200).json({
      status: 'success',
      msg: 'Logro desbloqueado correctamente',
      data: inventario.logros,
    })
  } catch (error) {
    next(error)
  }
}
