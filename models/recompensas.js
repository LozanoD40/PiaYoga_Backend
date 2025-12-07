import mongoose from 'mongoose'

const recompensaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  postura: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Postura',
    required: true,
  },

  puntos: { type: Number, default: 0 },
  dinero: { type: Number, default: 0 },

  accesorioDesbloqueado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accesorio',
    default: null,
  },

  fecha: { type: Date, default: Date.now },
})

export default mongoose.model('Recompensa', recompensaSchema)
