import UsuarioRutina from '../models/usuarioRutina.js'
import Rutina from '../models/rutina.js'

//ASIGNAR RUTINA A USUARIO
export const asignarRutina = async (req, res) => {
  try {
    const usuarioId = req.user.id
    const { rutinaId } = req.body

    const rutina = await Rutina.findById(rutinaId)
    if (!rutina) {
      return res.status(404).json({ error: 'Rutina no encontrada' })
    }

    // ❌ No permitir usar rutinas personalizadas de otros usuarios
    if (
      rutina.tipo === 'personalizado' &&
      rutina.creador.toString() !== usuarioId
    ) {
      return res.status(403).json({
        error: 'No puedes asignar rutinas personalizadas de otros usuarios',
      })
    }

    // ❌ Evitar duplicados
    const yaAsignada = await UsuarioRutina.findOne({
      usuario: usuarioId,
      rutina: rutinaId,
    })

    if (yaAsignada) {
      return res.status(400).json({
        error: 'Esta rutina ya está asignada al usuario',
      })
    }

    const usuarioRutina = await UsuarioRutina.create({
      usuario: usuarioId,
      rutina: rutinaId,
      fechaInicio: new Date(),
    })

    res.status(201).json({
      msg: 'Rutina asignada correctamente',
      usuarioRutina,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error asignando rutina' })
  }
}

//  OBTENER RUTINAS 
export const obtenerMisRutinas = async (req, res) => {
  try {
    const usuarioId = req.user.id

    const rutinas = await UsuarioRutina.find({ usuario: usuarioId }).populate({
      path: 'rutina',
      populate: [{ path: 'posturas.postura' }, { path: 'musica' }],
    })

    res.json(rutinas)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error obteniendo rutinas del usuario' })
  }
}

//  REGISTRAR PROGRESO
export const registrarProgreso = async (req, res) => {
  try {
    const usuarioId = req.user.id
    const { rutinaId, duracionMinutos } = req.body

    const usuarioRutina = await UsuarioRutina.findOne({
      usuario: usuarioId,
      rutina: rutinaId,
    })

    if (!usuarioRutina) {
      return res.status(404).json({ error: 'Rutina no asignada al usuario' })
    }

    usuarioRutina.progreso.push({
      fecha: new Date(),
      completado: true,
      duracionMinutos,
    })

    await usuarioRutina.save()

    res.json({
      msg: 'Progreso registrado correctamente',
      usuarioRutina,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error registrando progreso' })
  }
}

// COMPLETAR RUTINA
export const completarRutina = async (req, res) => {
  try {
    const usuarioId = req.user.id
    const { rutinaId } = req.body

    const usuarioRutina = await UsuarioRutina.findOne({
      usuario: usuarioId,
      rutina: rutinaId,
    }).populate('rutina')

    if (!usuarioRutina) {
      return res.status(404).json({ error: 'Rutina no asignada al usuario' })
    }

    if (usuarioRutina.completado) {
      return res.status(400).json({ error: 'Rutina ya completada' })
    }

    // 🎯 Reglas simples de recompensa (puedes ajustar)
    let puntos = usuarioRutina.rutina.tiempoTotal * 2

    if (usuarioRutina.rutina.dificultad === 'avanzado') {
      puntos += 50
    }

    usuarioRutina.puntosGanados += puntos
    usuarioRutina.completado = true
    usuarioRutina.fechaFinalizacion = new Date()

    await usuarioRutina.save()

    res.json({
      msg: 'Rutina completada',
      puntosGanados: puntos,
      usuarioRutina,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error completando rutina' })
  }
}

//DESASIGNAR RUTINA 
export const eliminarRutinaUsuario = async (req, res) => {
  try {
    const usuarioId = req.user.id
    const { rutinaId } = req.params

    const eliminada = await UsuarioRutina.findOneAndDelete({
      usuario: usuarioId,
      rutina: rutinaId,
    })

    if (!eliminada) {
      return res.status(404).json({ error: 'Rutina no encontrada' })
    }

    res.json({ msg: 'Rutina eliminada del usuario' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error eliminando rutina del usuario' })
  }
}
