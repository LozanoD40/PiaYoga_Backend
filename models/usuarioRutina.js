const usuarioRutinaSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },

    rutina: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rutina',
      required: true,
    },

    progreso: [
      {
        fecha: Date,
        completado: Boolean,
        duracionMinutos: Number,
      },
    ],

    puntosGanados: { type: Number, default: 0 },
    dineroGanado: { type: Number, default: 0 },

    completado: { type: Boolean, default: false },

    fechaInicio: { type: Date, default: Date.now },
    fechaFinalizacion: Date,
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('UsuarioRutina', usuarioRutinaSchema)
