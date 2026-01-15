import UsuarioInventario from '../models/usuarioInventario.js'
import Logro from '../models/logro.js'
import { AppError } from '../utils/errorHandler.js'

/*  Obtener inventario  */
/* En tu controlador usuarioInventarioController.js */
export const obtenerMiInventario = async (req, res, next) => {
  try {
    const usuarioId = req.user.id || req.user._id; // Aseguramos capturar el ID

    const inventario = await UsuarioInventario.findOne({
      usuario: usuarioId,
    }); // QUITAMOS EL .populate('logros.logro') PARA PROBAR

    if (!inventario) {
      // Si el usuario no tiene inventario, devolvemos null en vez de error 404
      // Esto evita que el front lance errores innecesarios
      return res.status(200).json({ status: 'success', data: null });
    }

    res.status(200).json({
      status: 'success',
      data: inventario,
    });
  } catch (error) {
    console.log("ERROR EN BACKEND:", error); // Esto saldrá en tu terminal de VS Code
    next(error);
  }
}

/* Crear inventario inicial */
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

/* Actualizar datos */
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

/*  Desbloquear logro manualmente  */
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
