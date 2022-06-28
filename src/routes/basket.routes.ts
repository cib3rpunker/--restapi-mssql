import { Router } from 'express'
import { addItemToBasket, getBasket,  } from '../controllers/basket.controller'
// import cookieParser from 'cookie-parser'

// app.use(cookieParser());

const router = Router()
console.log('🛸 Entering basket.routes.ts')

// GET api/basket
router.get('/basket', getBasket)

// POST api/basket?productId=1&quantity=2
router.post('/basket', addItemToBasket)

export default router
