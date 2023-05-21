const bodyParser = require('body-parser');
const express = require('express');
const routeProduct = require('./src/appliaction/router/produk');
const routeKaryawan = require('./src/appliaction/router/karyawan');
const app = express();
const fs = require('fs')
const bwip = require('bwip-js');

const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

app.listen(PORT, () => {
    console.log('Application running on port ', PORT)
});

app.use('/produk', routeProduct);
app.use('/karyawan', routeKaryawan);

app.get('/produk/barcode-image/:id', (req, res) => {
    const {id} = req.params
    const imagePath = __dirname + `/src/database/barcode/${id}.png`;
    res.sendFile(imagePath);
});