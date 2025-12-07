import express from 'express'
import { soloAdmin, verificarToken } from '../middleware/auth.js'
import {
  crearAccesorio,
  obtenerAccesorios,
  obtenerPorCategoria,
  obtenerAccesorio,
  actualizarAccesorio,
  eliminarAccesorio,
} from '../controllers/accesorioController.js'

// Controlador de música
import {
  crearMusica,
  listarMusica,
  obtenerMusica,
  editarMusica,
  eliminarMusica,
} from "../controllers/musicaController.js";

const router = express.Router()

// ACCESORIOS 
router.get('/', obtenerAccesorios)
router.get('/categoria/:categoria', obtenerPorCategoria)
router.get('/:id', obtenerAccesorio)

router.post('/', verificarToken, soloAdmin, crearAccesorio)
router.put('/:id', verificarToken, soloAdmin, actualizarAccesorio)
router.delete('/:id', verificarToken, soloAdmin, eliminarAccesorio)

// MÚSICA 
router.get("/musica", verificarToken, listarMusica);
router.get("/musica/:id", verificarToken, obtenerMusica);
router.post("/musica", verificarToken, soloAdmin, crearMusica);
router.put("/musica/:id", verificarToken, soloAdmin, editarMusica);
router.delete("/musica/:id", verificarToken, soloAdmin, eliminarMusica);

export default router
