import Reto from '../models/reto.js'
import Rutina from '../models/rutina.js';

export const crearReto = async (req, res) => {
  try {
    const reto = await Reto.create(req.body);

    // Crear Rutina tipo reto
    await Rutina.create({
      tipo: "reto",
      titulo: reto.titulo,
      descripcion: reto.descripcion,
      posturas: reto.posturas,
      recompensaExtra: reto.recompensaEspecial,
      dificultad: reto.dificultad
    });

    res.status(201).json({ reto, mensaje: "Reto creado y convertido a Rutina" });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear reto', error });
  }
};

export const obtenerRetos = async (req, res) => {
  try {
    const retos = await Reto.find()
      .populate('posturas')
      .populate('recompensaEspecial.accesorioEspecial')
    res.status(200).json(retos)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener retos', error })
  }
}

export const obtenerReto = async (req, res) => {
  try {
    const reto = await Reto.findById(req.params.id)
      .populate('posturas')
      .populate('recompensaEspecial.accesorioEspecial')

    if (!reto) return res.status(404).json({ message: 'Reto no encontrado' })

    res.status(200).json(reto)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reto', error })
  }
}

export const actualizarReto = async (req, res) => {
  try {
    const reto = await Reto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    if (!reto) return res.status(404).json({ message: 'Reto no encontrado' })

    res.status(200).json(reto)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar reto', error })
  }
}

export const eliminarReto = async (req, res) => {
  try {
    const reto = await Reto.findByIdAndDelete(req.params.id)

    if (!reto) return res.status(404).json({ message: 'Reto no encontrado' })

    res.status(200).json({ message: 'Reto eliminado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar reto', error })
  }
}
