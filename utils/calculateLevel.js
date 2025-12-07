export function calcularNivel(peso, edad, estilo) {
  let nivelBase = 1

  if (estilo === 'sedentario') nivelBase = 1
  if (estilo === 'activo') nivelBase = 2
  if (estilo === 'deportista') nivelBase = 3
  if (estilo === 'atleta') nivelBase = 4

  if (edad < 25) nivelBase += 1
  if (edad > 40) nivelBase -= 1

  if (peso > 90) nivelBase -= 1
  if (peso < 60) nivelBase += 1

  const niveles = ['principiante', 'medio', 'estandar', 'experto', 'atleta']

  // Limitar entre 0 y 4
  return niveles[Math.max(0, Math.min(nivelBase - 1, 4))]
}
