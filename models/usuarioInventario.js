import mongoose from 'mongoose'

const usuarioInventarioSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
      unique: true,
    },

    perfil: {
      pesoKg: {
        type: Number,
        min: 20,
        max: 300,
      },

      alturaCm: {
        type: Number,
        min: 80,
        max: 250,
      },

      edad: {
        type: Number,
        min: 5,
        max: 120,
      },

      estiloVida: {
        type: String,
        enum: ['sedentario', 'ligeramente_activo', 'activo', 'muy_activo'],
        default: 'sedentario',
      },
    },

    logros: [
      {
        logro: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Logro',
          required: true,
        },

        desbloqueadoEn: {
          type: Date,
          default: Date.now,
        },

        motivo: {
          type: String, 
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('UsuarioInventario', usuarioInventarioSchema)
