import mongoose from 'mongoose'

const accesorioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: {
    type: String,
    required: true,
    enum: ['personaje', 'sombrero', 'banda', 'tapete', 'ropa', 'fondo'],
    required: true,
  },
  descripcion: { type: String },
  rareza: {
    type: String,
    enum: ['comun', 'raro', 'epico', 'legendario'],
    default: 'comun',
  },
  precio: { type: Number, default: 0 },
  imagen: { type: String },

  requisitos: {
    nivelMinimo: { type: Number, default: 0 },
    tareasCompletadas: { type: Number, default: 0 },
    logroNecesario: { type: String },
  },
})

export default mongoose.model('Accesorio', accesorioSchema)
