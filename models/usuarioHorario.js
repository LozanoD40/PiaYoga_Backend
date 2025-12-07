import mongoose from 'mongoose'

const usuarioHorarioSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
      unique: true, // Cada usuario solo tiene 1 horario
    },
    dias: {
      type: [String], // ["lunes", "miércoles", "viernes"]
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
      type: String, // "08:30"
      required: true,
    },
    horaFin: {
      type: String, // "09:15"
      required: true,
    },
    zonaHoraria: {
      type: String,
      default: 'UTC-5',
    },
    estado: {
      type: String,
      enum: ['activo', 'pausado'],
      default: 'activo',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('UsuarioHorario', usuarioHorarioSchema)
