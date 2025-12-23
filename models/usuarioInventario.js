import mongoose from 'mongoose'

const usuarioInventarioSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    unique: true,
  },
  items: [
    {
      accesorio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accesorio',
        required: true,
      },
      desbloqueadoEn: {
        type: Date,
        default: Date.now,
      },
      estado: {
        type: String,
        enum: ['activo', 'equipado', 'almacenado'],
        default: 'almacenado',
      },
    },
  ],
})

export default mongoose.model('UsuarioInventario', usuarioInventarioSchema)
