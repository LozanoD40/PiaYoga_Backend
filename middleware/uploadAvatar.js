import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: 'public/imagenesDePerfil',
  filename: (req, file, cb) => {
    const unique = Date.now() + path.extname(file.originalname)
    cb(null, unique)
  },
})

export const uploadAvatar = multer({ storage })
