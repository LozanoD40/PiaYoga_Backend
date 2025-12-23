import Rutina from '../models/rutina.js'
import Reto from '../models/reto.js'
import Accesorio from '../models/accesorio.js'
import UsuarioInventario from '../models/usuarioInventario.js'

export const generarRecompensa = async (req, res) => {
  try {
    const { rutinaId } = req.params
    const userId = req.user.id

    const rutina = await Rutina.findById(rutinaId)
    if (!rutina) return res.status(404).json({ error: 'Rutina no encontrada' })

    // Evita doble recompensa
    if (rutina.completado)
      return res.status(400).json({ error: 'Esta rutina ya fue completada' })

    let oro = 0
    let accesorioGanado = null

    // 🟥 1) Si es un RETO → recompensa fija
    const reto = await Reto.findOne({ rutina: rutina._id })
    if (reto) {
      oro = reto.recompensaOro
      if (reto.recompensaAccesorio) {
        accesorioGanado = await Accesorio.findById(reto.recompensaAccesorio)
      }
    } else {
      // 🟦 2) Rutina normal → cálculo de oro
      oro = Math.round(
        rutina.energiaTotal * 0.5 +
          rutina.tiempoTotal * 1 +
          rutina.dificultadPromedio * 10
      )

      // Probabilidad de lootbox
      const probLoot = [0, 10, 20, 35, 50, 70][rutina.dificultadPromedio]
      const ganoLoot = Math.random() * 100 < probLoot

      if (ganoLoot) {
        // Elegir rareza
        const probabilidades = {
          comun: 60,
          raro: 25,
          epico: 10,
          legendario: 5,
        }

        const seleccionarRareza = () => {
          const rand = Math.random() * 100
          let acum = 0
          for (let r in probabilidades) {
            acum += probabilidades[r]
            if (rand <= acum) return r
          }
          return 'comun'
        }

        const rareza = seleccionarRareza()

        const accesorios = await Accesorio.find({ rareza })
        if (accesorios.length > 0) {
          const idx = Math.floor(Math.random() * accesorios.length)
          accesorioGanado = accesorios[idx]
        }
      }
    }

    // Guardar en inventario del usuario
    let inventario = await UsuarioInventario.findOne({ usuario: userId })

    if (!inventario) {
      inventario = await UsuarioInventario.create({ usuario: userId })
    }

    inventario.dinero += oro

    if (accesorioGanado) {
      inventario.accesorios.push(accesorioGanado._id)
    }

    await inventario.save()

    // Marcar rutina como completada
    rutina.completado = true
    rutina.fechaCompletado = new Date()
    rutina.totalDineroGanado = oro
    if (accesorioGanado) rutina.totalPuntosGanados = 1
    await rutina.save()

    res.json({
      mensaje: '¡Recompensa generada!',
      oro,
      accesorio: accesorioGanado,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error generando recompensa' })
  }
}
