import mongoose from 'mongoose'

const pushSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false,
  },
  subscription: { type: Object, required: true }, // guarda el objeto de la API Push
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('PushSubscription', pushSchema)
