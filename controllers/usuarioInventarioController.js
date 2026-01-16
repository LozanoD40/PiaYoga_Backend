import UsuarioInventario from '../models/usuarioInventario.js'
import Logro from '../models/logro.js'
import { AppError } from '../utils/errorHandler.js'

/*Perfil */
export const obtenerDatos = async (req, res, next) => {
  try {
    const usuarioId = req.user.id || req.user._id

    const inventario = await UsuarioInventario.findOne({
      usuario: usuarioId,
    }).select('perfil')

    if (!inventario) {
      return res.status(200).json({
        status: 'success',
        data: null,
      })
    }

    res.status(200).json({
      status: 'success',
      data: inventario.perfil,
    })
  } catch (error) {
    next(error)
  }
}

export const actualizaDatos = async (req, res, next) => {
  try {
    const usuarioId = req.user.id
    const { pesoKg, alturaCm, edad, estiloVida } = req.body

    let inventario = await UsuarioInventario.findOne({ usuario: usuarioId })

    // 🔥 SI NO EXISTE, LO CREAMOS
    if (!inventario) {
      inventario = await UsuarioInventario.create({
        usuario: usuarioId,
        perfil: {},
        logros: [],
      })
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
      data: inventario.perfil,
    })
  } catch (error) {
    next(error)
  }
}

/*Logros*/
export const obtenerMisLogros = async (req, res, next) => {
  try {
    const usuarioId = req.user.id || req.user._id

    const inventario = await UsuarioInventario.findOne({
      usuario: usuarioId,
    }).populate('logros.logro')

    if (!inventario) {
      return next(new AppError('Inventario no encontrado', 404))
    }

    res.status(200).json({
      status: 'success',
      data: inventario.logros,
    })
  } catch (error) {
    next(error)
  }
}

export const desbloquearLogro = async (req, res, next) => {
  try {
    const usuarioId = req.user.id || req.user._id
    const { logroId, motivo } = req.body

    if (!logroId) {
      return next(new AppError('Debes enviar el ID del logro', 400))
    }

    const logro = await Logro.findById(logroId)
    if (!logro) {
      return next(new AppError('El logro no existe', 404))
    }

    const inventario = await UsuarioInventario.findOne({
      usuario: usuarioId,
    })

    if (!inventario) {
      return next(new AppError('Inventario no encontrado', 404))
    }

    const yaExiste = inventario.logros.some(
      (l) => l.logro.toString() === logroId
    )

    if (yaExiste) {
      return next(new AppError('Este logro ya fue desbloqueado', 400))
    }

    inventario.logros.push({ logro: logroId, motivo })
    await inventario.save()

    res.status(201).json({
      status: 'success',
      msg: 'Logro desbloqueado correctamente',
      data: inventario.logros,
    })
  } catch (error) {
    next(error)
  }
}
