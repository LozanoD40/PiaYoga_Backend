import webpush from 'web-push'
import dotenv from 'dotenv'
dotenv.config()

const publicKey = process.env.VAPID_PUBLIC
const privateKey = process.env.VAPID_PRIVATE
const email = process.env.VAPID_EMAIL

if (!publicKey || !privateKey || !email) {
  console.warn('⚠️ VAPID keys no configuradas en .env')
}

webpush.setVapidDetails(email, publicKey, privateKey)

export default webpush
