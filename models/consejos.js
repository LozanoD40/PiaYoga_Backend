import mongoose from 'mongoose'

const consejoSchema = new mongoose.Schema({
  texto: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  imagen: {
    type: String, // URL o ruta
    required: false,
  },
  categoria: {
    type: String,
    enum: ['motivation', 'postura', 'salud', 'respiracion', 'general'],
    default: 'general',
  },
  activo: {
    type: Boolean,
    default: true,
  },
  creadoEn: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('Consejo', consejoSchema)
