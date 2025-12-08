import Rutina from '../models/rutina.js'
import { generarRecompensa } from './recompensaController.js'
import UsuarioInventario from '../models/usuarioInventario.js'
import Recompensa from '../models/recompensas.js'
import Usuario from '../models/usuario.js'
import Accesorio from '../models/accesorio.js'


// Crear rutina
export const crearRutina = async (req, res) => {
  try {
    const rutina = await Rutina.create(req.body)

    res.status(201).json({
      message: 'Rutina creada',
      rutina,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear rutina' })
  }
}

// Obtener todas las rutinas
export const obtenerRutinas = async (req, res) => {
  try {
    const rutinas = await Rutina.find().populate('posturas')

    res.json(rutinas)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener rutinas' })
  }
}

// Obtener una rutina
export const obtenerRutina = async (req, res) => {
  try {
    const rutina = await Rutina.findById(req.params.id).populate('posturas')

    if (!rutina)
      return res.status(404).json({ message: 'Rutina no encontrada' })

    res.json(rutina)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la rutina' })
  }
}

// Eliminar rutina
export const eliminarRutina = async (req, res) => {
  try {
    await Rutina.findByIdAndDelete(req.params.id)

    res.json({ message: 'Rutina eliminada' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar rutina' })
  }
}


export const completarRutina = async (req, res) => {
  try {
    const { usuarioId, rutinaId } = req.body

    const rutina = await Rutina.findById(rutinaId).populate('posturas')
    if (!rutina)
      return res.status(404).json({ message: 'Rutina no encontrada' })

    const usuario = await Usuario.findById(usuarioId)
    if (!usuario)
      return res.status(404).json({ message: 'Usuario no encontrado' })

    let recompensasGeneradas = []
    let totalPuntos = 0
    let totalDinero = 0

    // 1. Generar recompensa por cada postura
    for (const postura of rutina.posturas) {
      req.body = { usuarioId, posturaId: postura._id }
      const r = await generarRecompensa(req, {
        status: () => ({ json: () => {} }), // respuesta vacía
      })

      recompensasGeneradas.push(r.recompensa)
      totalPuntos += r.recompensa.puntos
      totalDinero += r.recompensa.dinero
    }

    // 2. Si es una rutina de reto, añadir recompensa extra
    let accesorioExtra = null
    if (rutina.tipo === 'reto') {
      usuario.puntos += rutina.recompensaExtra.puntos || 0
      usuario.dinero += rutina.recompensaExtra.dinero || 0

      if (rutina.recompensaExtra.accesorio) {
        // dar accesorio especial
        await UsuarioInventario.create({
          usuario: usuarioId,
          accesorio: rutina.recompensaExtra.accesorio,
        })

        accesorioExtra = rutina.recompensaExtra.accesorio
      }

      await usuario.save()
    }

    res.json({
      message: 'Rutina completada',
      recompensasGeneradas,
      totalPuntos,
      totalDinero,
      retoExtra: rutina.tipo === 'reto' ? rutina.recompensaExtra : null,
      accesorioExtra,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al completar la rutina' })
  }
}