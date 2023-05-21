const { uid } = require('uid');
const fs = require('fs')

const pathFile = 'src/database/karyawan.json';

const existFile = (res) => {
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

const catchErrorHandle = (res, code, err) => {
    res.status(code).json({
        code: code,
        status: 'error',
        msg: err.message
    })
}

const readFile = () => {
    const data = fs.readFileSync(pathFile);
    const dataJson = JSON.parse(data);
    return dataJson;
}

const addKaryawan = (req, res) => {
    try {
        const id = uid();
        const { nama, alamat, usia, jenisKelamin } = req.body;
        try {
            if(nama == null) throw new Error('nama is required.')
            if(alamat == null) throw new Error('alamat is required.')
            if(usia == null) throw new Error('usia is required.')
            if(jenisKelamin == null) throw new Error('jenisKelamin is required.')

        } catch (err) {
            catchErrorHandle(res, 400, err)
        }
        const newData = {
            id,
            nama,
            alamat,
            usia,
            jenisKelamin,
        }
        const data = readFile();
        data.push(newData);
        const dataString = JSON.stringify(data);
        fs.writeFileSync(pathFile, dataString);
        res.status(201).json({
            code: 201,
            status: 'success',
            msg: 'Add karyawan successfully',
            data: newData
        })
    } catch(err) {
        catchErrorHandle(res, 500, err)
    }
};

const getKaryawan = (req, res) => {
    try {
        existFile(res)
        const data = readFile();
        res.status(200).json({
            code: 200,
            status: 'success',
            msg: 'Get data success',
            data: data
        })
    } catch (err) {
        catchErrorHandle(res, 500, err);
    }
}

const getKaryawanById = (req, res) => {
    try {
        existFile(res);
        const { id } = req.params;
        const data = readFile()
        const index = data.findIndex(d => d.id == id);
        if(index != -1) {
            res.status(200).json({
                code: 200,
                status: 'success',
                msg: 'Get karyawan by id successfully.',
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
        catchErrorHandle(res, 500, err);
    }
}

const updateKaryawanById = (req, res) => {
    try {
        existFile(res);
        const {id} = req.params;
        const { nama, alamat, usia, jenisKelamin } = req.body;
        const dataJson = readFile();
        const newData = {
            id,
            nama,
            alamat,
            usia,
            jenisKelamin
        }
        const index = dataJson.findIndex(d => d.id == id);
        if (index != -1){
            dataJson[index] = newData;
            const dataString = JSON.stringify(dataJson);
            fs.writeFileSync(pathFile, dataString);
            res.status(200).json({
                code: 200,
                status: 'success',
                msg: 'Update karyawan successfully.',
                data: dataJson[index]
            })
        } else {
            res.status(400).json({
                code: 400,
                status: 'error',
                msg: 'Id not found.'
            })
        }
    } catch (err) {
        catchErrorHandle(res, 500, err);
    }
}

const deleteKaryawan = (req, res) => {
    try {
        const { id } = req.params;
        existFile(res);
        const data = readFile();
        const index = data.findIndex(e => e.id === id);
        if(index != -1){
            data.splice(index, 1);
            const dataString = JSON.stringify(data);
            fs.writeFileSync(pathFile, dataString);
            res.status(200).json({
                code: 200,
                status: 'success',
                msg: 'Delete karyawan successfully.',
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

module.exports = {
    addKaryawan,
    getKaryawan,
    getKaryawanById,
    updateKaryawanById,
    deleteKaryawan
}

