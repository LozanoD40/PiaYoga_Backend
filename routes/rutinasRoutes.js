import express from 'express'
import { generarRecompensa } from '../controllers/recompensaController.js'

const router = express.Router()

router.post('/generar', generarRecompensa)

export default router
