const express = require('express');
const route = express.Router();
const controllerProduk = require('../controller/produk');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const upload = multer({ dest : path.resolve('./tmp')})

route.get('/', controllerProduk.getProduct);
route.get('/:id', controllerProduk.getProductById);
route.post('/add-product', auth, controllerProduk.addProduct);
route.put('/update-product/:id', auth, controllerProduk.updateProduct);
route.delete('/delete-product/:id', auth, controllerProduk.deleteProduct);
route.post('/add-image/:id', auth, upload.single('image'), controllerProduk.uploadImage);

module.exports = route;