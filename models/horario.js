import mongoose from 'mongoose'

const horarioSchema = new mongoose.Schema(
  {
    dias: {
      type: [String],
      enum: [
        'lunes',
        'martes',
        'miércoles',
        'jueves',
        'viernes',
        'sábado',
        'domingo',
      ],
      required: true,
    },
    horaInicio: {
      type: String,
      required: true,
    },
    horaFin: {
      type: String,
      required: true,
    },
    estado: {
      type: Boolean,
      default: true, // true = disponible
    },
  },
  { timestamps: true }
)

export default mongoose.model('Horario', horarioSchema)
