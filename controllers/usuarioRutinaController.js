import Rutina from '../models/rutina.js'
import Postura from '../models/postura.js'
import Usuario from '../models/usuario.js'
import Accesorio from '../models/accesorio.js'

// ---------------------------------------------
// 1) ASIGNAR RUTINA A UN USUARIO
// ---------------------------------------------
export const asignarRutina = async (req, res) => {
  try {
    const usuarioId = req.user.id
    const { rutinaId } = req.body

    const rutina = await Rutina.findById(rutinaId)
    if (!rutina) return res.status(404).json({ error: 'Rutina no encontrada' })

    // Asignar usuario si era predefinida o reto
    rutina.usuario = usuarioId
    await rutina.save()

    return res.json({ mensaje: 'Rutina asignada correctamente', rutina })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error asignando rutina' })
  }
}

// ---------------------------------------------
// 2) OBTENER TODAS LAS RUTINAS DEL USUARIO
// ---------------------------------------------
export const obtenerMisRutinas = async (req, res) => {
  try {
    const usuarioId = req.user.id

    const rutinas = await Rutina.find({ usuario: usuarioId }).populate(
      'posturas'
    )

    return res.json(rutinas)
  } catch (error) {
    return res.status(500).json({ error: 'Error obteniendo rutinas' })
  }
}

// ---------------------------------------------
// 3) MARCAR PROGRESO DE UNA RUTINA
// ---------------------------------------------
export const marcarProgreso = async (req, res) => {
  try {
    const usuarioId = req.user.id
    const { rutinaId, semana, duracionMinutos, intensidad } = req.body

    const rutina = await Rutina.findOne({ _id: rutinaId, usuario: usuarioId })
    if (!rutina) return res.status(404).json({ error: 'Rutina no encontrada' })

    const registro = {
      semana,
      duracionMinutos,
      intensidad,
      completado: false,
    }

    rutina.progresion.push(registro)
    await rutina.save()

    return res.json({ mensaje: 'Progreso registrado', rutina })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error guardando progreso' })
  }
}

// ---------------------------------------------
// 4) COMPLETAR RUTINA (otorga recompensas)
// ---------------------------------------------
export const completarRutina = async (req, res) => {
  try {
    const usuarioId = req.user.id
    const { rutinaId } = req.body

    const rutina = await Rutina.findOne({
      _id: rutinaId,
      usuario: usuarioId,
    }).populate('posturas')
    if (!rutina) return res.status(404).json({ error: 'Rutina no encontrada' })

    if (rutina.completado) {
      return res.status(400).json({ error: 'Rutina ya completada' })
    }

    // 1) Calcular recompensas
    let puntos = 0
    let dinero = 0

    rutina.posturas.forEach((p) => {
      puntos += p.puntos || 0
      dinero += p.dinero || 0
    })

    // BONUS SI ES RETO
    if (rutina.tipo === 'reto') {
      puntos *= 2
      dinero *= 2
    }

    rutina.totalPuntosGanados = puntos
    rutina.totalDineroGanado = dinero

    rutina.completado = true
    rutina.fechaCompletado = new Date()
    await rutina.save()

    return res.json({
      mensaje: 'Rutina completada',
      puntosGanados: puntos,
      dineroGanado: dinero,
      rutina,
    })
  } catch (error) {
    return res.status(500).json({ error: 'Error completando rutina' })
  }
}

// ---------------------------------------------
// 5) ELIMINAR UNA RUTINA DEL USUARIO
// ---------------------------------------------
export const eliminarRutina = async (req, res) => {
  try {
    const usuarioId = req.user.id
    const { rutinaId } = req.params

    const rutina = await Rutina.findOneAndDelete({
      _id: rutinaId,
      usuario: usuarioId,
    })
    if (!rutina) return res.status(404).json({ error: 'Rutina no encontrada' })

    return res.json({ mensaje: 'Rutina eliminada correctamente' })
  } catch (error) {
    return res.status(500).json({ error: 'Error eliminando rutina' })
  }
}
