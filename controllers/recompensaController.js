import Postura from '../models/postura.js'
import Accesorio from '../models/accesorio.js'
import UsuarioInventario from '../models/usuarioInventario.js'
import Recompensa from '../models/recompensas.js'
import Usuario from '../models/usuario.js'

export const generarRecompensa = async (req, res) => {
  try {
    const { usuarioId, posturaId } = req.body

    const postura = await Postura.findById(posturaId)
    if (!postura)
      return res.status(404).json({ message: 'Postura no encontrada' })

    const usuario = await Usuario.findById(usuarioId)
    if (!usuario)
      return res.status(404).json({ message: 'Usuario no encontrado' })

    // 1. Calcular puntos y dinero
    const puntos = Math.floor(postura.energiaGastada * postura.dificultad)
    const dinero = Math.floor(puntos * 0.25)

    usuario.dinero = (usuario.dinero || 0) + dinero
    usuario.puntos = (usuario.puntos || 0) + puntos
    await usuario.save()

    // 2. Verificar accesorios desbloqueables
    const posibles = await Accesorio.find({
      'requisitos.nivelMinimo': { $lte: usuario.nivel },
      'requisitos.tareasCompletadas': { $lte: usuario.tareasCompletadas },
      $or: [
        { 'requisitos.logroNecesario': null },
        { 'requisitos.logroNecesario': usuario.logroActual },
      ],
    })

    let accesorioDesbloqueado = null

    for (const acc of posibles) {
      const yaLoTiene = await UsuarioInventario.findOne({
        usuario: usuarioId,
        accesorio: acc._id,
      })

      if (!yaLoTiene) {
        await UsuarioInventario.create({
          usuario: usuarioId,
          accesorio: acc._id,
        })

        accesorioDesbloqueado = acc._id
        break
      }
    }

    // 3. Guardar recompensa
    const recompensa = await Recompensa.create({
      usuario: usuarioId,
      postura: posturaId,
      puntos,
      dinero,
      accesorioDesbloqueado,
    })

    return res.status(200).json({
      message: 'Recompensa generada',
      recompensa,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al generar recompensa' })
  }
}

