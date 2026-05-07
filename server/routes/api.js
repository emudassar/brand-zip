import express from 'express'
import multer from 'multer'
import {
  generateKit,
  getOrderAssets,
  getOrderStatus,
} from '../controllers/generationController.js'
import { markOrderPaid } from '../controllers/orderController.js'

const router = express.Router()

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
    return
  }

  cb(new Error('Only JPEG and PNG files are allowed'), false)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

router.post('/generate', upload.single('selfie'), generateKit)
router.get('/kit/:orderId', getOrderStatus)
router.get('/kit/:orderId/assets', getOrderAssets)
router.post('/order/:orderId/paid', markOrderPaid)

export default router
