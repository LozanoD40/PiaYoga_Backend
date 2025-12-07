// --------------------------------------------------------
// 1. Clase de error personalizada (para errores controlados)
// --------------------------------------------------------
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true
  }
}

// --------------------------------------------------------
// 2. Handlers para errores específicos de MongoDB / JWT
// --------------------------------------------------------
const handleCastErrorDB = (err) => {
  const message = `ID inválido: ${err.value}`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0]
  const value = err.keyValue[field]
  return new AppError(
    `El valor '${value}' ya está registrado en '${field}'.`,
    400
  )
}

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((e) => e.message)
  return new AppError(`Datos inválidos: ${errors.join('. ')}`, 400)
}

const handleJWTError = () =>
  new AppError('Token inválido. Inicia sesión nuevamente.', 401)

const handleJWTExpiredError = () =>
  new AppError('Token expirado. Vuelve a iniciar sesión.', 401)

// --------------------------------------------------------
// 3. Middleware final de manejo de errores
// --------------------------------------------------------
export const handleError = (err, req, res, next) => {
  console.error('ERROR CAPTURADO:', err)

  let error = { ...err, message: err.message }

  if (err.name === 'CastError') error = handleCastErrorDB(err)
  if (err.code === 11000) error = handleDuplicateFieldsDB(err)
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err)
  if (err.name === 'JsonWebTokenError') error = handleJWTError()
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError()

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      msg: error.message,
    })
  }

  console.error('ERROR NO OPERACIONAL:', err)

  return res.status(500).json({
    status: 'error',
    msg: 'Error interno del servidor. Intenta más tarde.',
  })
}

// --------------------------------------------------------
// 4. Función auxiliar createError
// --------------------------------------------------------
export const createError = (statusCode, message) => {
  return new AppError(message, statusCode)
}
