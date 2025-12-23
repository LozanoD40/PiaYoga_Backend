// models/usuarioPersonaje.js
import mongoose from 'mongoose'

const usuarioPersonajeSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    unique: true,
    required: true,
  },

  personaje: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accesorio',
    default: null,
  },

  sombrero: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accesorio',
    default: null,
  },

  banda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accesorio',
    default: null,
  },

  tapete: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accesorio',
    default: null,
  },

  ropa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accesorio',
    default: null,
  },

  fondo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accesorio',
    default: null,
  },
})

export default mongoose.model('UsuarioPersonaje',usuarioPersonajeSchema)

