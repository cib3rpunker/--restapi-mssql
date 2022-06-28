import { Router } from 'express'
import {
  getProducts,
  // createNewProduct,
  getProductById,
  // deleteProductById,
  // getTotalProducts,
  // updateProductById,
} from '../controllers/products.controller'

const router = Router()

console.log('🛸 Entering products.routes.js')

router.get('/products', getProducts)
router.get('/products/:id', getProductById)

// router.post("/products", createNewProduct);

// router.get("/products/count", getTotalProducts);

// router.delete("/products/:id", deleteProductById);

// router.put("/products/:id", updateProductById);

export default router
