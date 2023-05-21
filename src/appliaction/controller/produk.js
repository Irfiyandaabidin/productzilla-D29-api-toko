const fs = require('fs');
const bwipJs = require('bwip-js');
const { uid } = require('uid');
const path = require('path')

const pathFile = 'src/database/product.json';
const pathBarcode = 'src/database/barcode/';

const catchErrorHandle = (res, code, err) => {
    res.status(code).json({
        code: code,
        status: 'error',
        msg: err.message
    })
}

const existFile = (req, res) => {
    const exist = fs.existsSync(pathFile);
    if(!exist){
        fs.writeFileSync(pathFile, '[]');
        res.status(200).json({
            code: 200,
            status: 'success',
            msg: 'Data belum ada.'
        })
    }
}

const readData = () => {
    const data = fs.readFileSync(pathFile);
    const dataJson = JSON.parse(data);
    return dataJson
}

const getProduct = (req, res) => {
    try {
        existFile(req, res);
        fs.readFile(pathFile, (err, data) => {
            const dataJson = JSON.parse(data);
            if(err) throw err;
            res.status(200).json({
                code: 200,
                status: 'success',
                msg: 'Succes get data.',
                data: dataJson
            })
        })
    } catch (err) {
        catchErrorHandle(res, 500, err)
    }
}

const addProduct = (req, res) => {
    try {
        const id = uid();
        const { nama } = req.body;
        const { harga } = req.body;
        const { stok } = req.body;
        const { tipe } = req.body;
        const barcode = {
            nama,
            harga,
            tipe
        };
        if(nama == null) throw new Error('nama required')
        if(harga == null) throw new Error('harga required')
        if(stok == null) throw new Error('stok required')
        if(tipe == null) throw new Error('tipe required')
        const dataJson = readData();
        const urlBarcode = pathBarcode + `${id}.png`
        const newData = {
            id,
            nama,
            harga,
            barcode : urlBarcode,
            stok,
            tipe
        }
        dataJson.push(newData);
        const dataString = JSON.stringify(dataJson);
        const barcodeString = JSON.stringify(barcode);
        const options = {bcid: 'code128', text: barcodeString};
        bwipJs.toBuffer(options, (err, buffer) => {
            if(err){
                catchErrorHandle(res, 500, err);
            } else {
                fs.writeFile(pathBarcode + `${id}.png`, buffer, (err) => {
                    if(err) throw new Error;
                })
            }
        })
        fs.writeFileSync(pathFile, dataString)
        res.status(201).json({
            code: 201,
            status: 'success',
            msg: 'Add product successfully.',
            data: newData
        })
    } catch (err) {
        catchErrorHandle(res, 400, err)
    }
}

const getProductById = (req, res) => {
    try{
        const { id } = req.params;
        existFile(req, res);
        const dataJson = readData();
        const index = dataJson.findIndex(e => e.id == id);
        if(index == -1) throw new Error('Id not found.');
        res.status(200).json({ 
            code: 200,
            status: 'success',
            msg: 'Get product sucessfully.',
            data: dataJson[index]
        })
    } catch (err) {
        catchErrorHandle(res, 400, err)
    }
}

const updateProduct = (req, res) => {
    try {
        const { id } = req.params;
        const { nama } = req.body;
        const { harga } = req.body;
        const { stok } = req.body;
        const { tipe } = req.body;
        existFile(req, res);
        const data = readData();
        const index = data.findIndex((e) => e.id === id);
        if(index != -1) {
            const newData = {
                id,
                nama,
                harga,
                stok,
                tipe,
                barcode : data[index].barcode
            }
            data[index] = newData;
            const dataString = JSON.stringify(data);
            const options = {bcid: 'code128', text: dataString}
            bwipJs.toBuffer(options, (err, buffer) => {
                if (err){
                    catchErrorHandle(res, 500, err)
                } else {
                    fs.writeFile(pathFile + `${id}.png`, buffer, (err) => {
                        if(err) throw new Error;
                    })
                }
            })
            fs.writeFileSync(pathFile, dataString);
            res.status(200).json({
                code: 200,
                status: 'success',
                msg: 'Update product successfully.',
                data: data[index]                
            })
        } else {
            res.status(400).json({
                code: 400,
                status: 'error',
                msg: 'Id not found.'
            })
        }
    } catch (err) {
        catchErrorHandle(res, 400, err);
    }
}

const deleteProduct = (req, res) => {
    try {
        const { id } = req.params;
        existFile(req, res);
        const data = readData();
        const index = data.findIndex(e => e.id === id);
        if(index != -1){
            data.splice(index, 1);
            const dataString = JSON.stringify(data);
            fs.unlink(pathBarcode + `${id}.png`, (err) => {
                if(err) throw new Error;
            })
            fs.writeFileSync(pathFile, dataString);
            res.status(200).json({
                code: 200,
                status: 'success',
                msg: 'Delete product successfully.',
            })
        } else {
            res.status(404).json({
                code: 404,
                status: 'error',
                msg: 'Id not found.'
            })
        }
    } catch (err) {
        catchErrorHandle(res, 500, err);
    }
}

const uploadImage = (req, res) => {
    try {
      const { id } = req.params;
      const metaData = req.file;
      const extensionName = metaData.originalname.split(".").pop();
      const oldPath = metaData.path;
      fs.renameSync(
        oldPath,
        path.resolve(`public/images/${id}.${extensionName}`)
      );
      res.status(200).json({
        msg: "Berhasil menambahkan image produk",
      });
    } catch (err) {
      res.json({ msg: "Failed add image product." });
    }
};

module.exports = {
    getProduct,
    addProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadImage
}