import Musica from '../models/musica.js'
import { createError } from '../utils/errorHandler.js'

// Crear música
export const crearMusica = async (req, res, next) => {
  try {
    const { titulo, archivoAudio } = req.body

    if (!titulo || !archivoAudio) {
      return next(
        createError(400, 'Título y archivo de audio son obligatorios')
      )
    }

    const musica = new Musica(req.body)
    await musica.save()

    res.status(201).json({
      mensaje: 'Música creada exitosamente',
      musica,
    })
  } catch (error) {
    next(error)
  }
}

// Listar toda la música
export const listarMusica = async (req, res, next) => {
  try {
    const lista = await Musica.find()
    res.json(lista)
  } catch (error) {
    next(error)
  }
}

// Obtener una música por ID
export const obtenerMusica = async (req, res, next) => {
  try {
    const musica = await Musica.findById(req.params.id)

    if (!musica) {
      return next(createError(404, 'Música no encontrada'))
    }

    res.json(musica)
  } catch (error) {
    next(error)
  }
}

// Editar música
export const editarMusica = async (req, res, next) => {
  try {
    const musica = await Musica.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    res.json({
      mensaje: 'Música actualizada',
      musica,
    })
  } catch (error) {
    next(error)
  }
}

// Eliminar música
export const eliminarMusica = async (req, res, next) => {
  try {
    await Musica.findByIdAndDelete(req.params.id)
    res.json({ mensaje: 'Música eliminada' })
  } catch (error) {
    next(error)
  }
}
