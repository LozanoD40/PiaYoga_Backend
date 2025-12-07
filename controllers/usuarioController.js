import Usuario from '../models/usuario.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { AppError } from '../utils/errorHandler.js'

// Generar JWT
const generarJWT = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

// Registro
export const registrar = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body

    if (!nombre || !email || !password) {
      throw new AppError('Todos los campos son obligatorios', 400)
    }

    const existe = await Usuario.findOne({ email })
    if (existe) {
      throw new AppError('El correo ya está registrado', 400)
    }

    const usuario = new Usuario(req.body)
    await usuario.save()

    res.status(201).json({
      msg: 'Usuario registrado correctamente',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      throw new AppError('Usuario no encontrado', 400)
    }

    if (!usuario.activo) {
      throw new AppError('Tu cuenta está suspendida', 403)
    }

    const passwordCorrecto = await bcrypt.compare(password, usuario.password)
    if (!passwordCorrecto) {
      throw new AppError('Contraseña incorrecta', 400)
    }

    res.json({
      token: generarJWT(usuario._id, usuario.rol),
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        avatar: usuario.avatar,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Obtener Perfil
export const perfil = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.user.id).select('-password')
    res.json(usuario)
  } catch (error) {
    next(error)
  }
}

// Actualizar perfil
export const actualizarPerfil = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.user.id)

    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404)
    }

    usuario.nombre = req.body.nombre ?? usuario.nombre
    usuario.avatar = req.body.avatar ?? usuario.avatar

    await usuario.save()

    res.json({ msg: 'Perfil actualizado', usuario })
  } catch (error) {
    next(error)
  }
}

// ADMIN — Listar usuarios
export const listarUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find().select('-password')
    res.json(usuarios)
  } catch (error) {
    next(error)
  }
}

// ADMIN — Cambiar rol
export const cambiarRol = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.params.id)

    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404)
    }

    usuario.rol = req.body.rol ?? usuario.rol
    await usuario.save()

    res.json({ msg: 'Rol actualizado', usuario })
  } catch (error) {
    next(error)
  }
}

// ADMIN — Activar / Desactivar
export const cambiarEstado = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.params.id)

    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404)
    }

    usuario.activo = !usuario.activo
    await usuario.save()

    res.json({
      msg: `Usuario ${usuario.activo ? 'reactivado' : 'desactivado'}`,
    })
  } catch (error) {
    next(error)
  }
}

// ADMIN — Eliminar usuario
export const eliminarUsuario = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id)

    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404)
    }

    res.json({ msg: 'Usuario eliminado' })
  } catch (error) {
    next(error)
  }
}
