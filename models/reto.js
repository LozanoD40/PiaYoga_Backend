import mongoose from 'mongoose'

const retoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: String,

    rutina: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rutina',
      required: true,
    },

    recompensaOro: { type: Number, default: 0 },
    recompensaAccesorio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Accesorio',
      default: null,
    },

    fechaInicio: Date,
    fechaFin: Date,

    estado: {
      type: String,
      enum: ['activo', 'oculto', 'finalizado'],
      default: 'activo',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Reto', retoSchema)
