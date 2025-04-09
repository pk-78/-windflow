import express from 'express';
// import upload from '../utils/cloudinaryStorage.js';
import Product from '../models/product.model.js';
import upload from '../middleware/multer.js';
import { getAllProducts, getProductById, mainImage } from '../controllers/product.controller.js';


const router = express.Router();

router.post('/create-product', upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),mainImage)
router.get("/getAllProduct",getAllProducts)
router.get("/getproduct/:id",getProductById)

export default router;