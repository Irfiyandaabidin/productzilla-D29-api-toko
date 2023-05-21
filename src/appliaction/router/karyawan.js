const express = require('express');
const route = express.Router();
const controllerKaryawan = require('../controller/karyawan'); 
const auth = require('../middleware/auth');

route.get('/', controllerKaryawan.getKaryawan);
route.post('/add-karyawan', auth, controllerKaryawan.addKaryawan);
route.get('/:id', controllerKaryawan.getKaryawanById);
route.put('/update-karyawan/:id', auth, controllerKaryawan.updateKaryawanById);
route.delete('/delete-karyawan/:id', auth, controllerKaryawan.deleteKaryawan);

module.exports = route