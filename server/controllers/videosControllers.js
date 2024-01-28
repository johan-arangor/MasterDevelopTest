const servicesController = {};
const mysql = require('../src/middleware/connection');

servicesController.getAllVideos = async (req, res) => {
    let dataForm = req.params.id;

    mysql.query(`SELECT * FROM categories_sub WHERE id_category = ${dataForm} AND disable = 0`, 
    function (err, result) 
    {
        if (err) {
            res.status(500).json({
                data: null,
                message: {
                    title: "Ocurrion un error inesperado",
                    text: `error ${err}`,
                    icon: "error"
                }
            });
        } else {
            res.status(200).json({
                data: result
            });
        }
    });
}

servicesController.newVideo = async (req, res) => {
    let dataForm = req.body;
    
    mysql.query(`INSERT INTO categories_sub (${Object.keys(dataForm).join(",")}) 
    VALUES ('${dataForm.name}', ${dataForm.id_category})`, 
    function (err, result) 
    {
        if (err) {
            res.status(500).json({
                data: null,
                message: {
                    title: "Ocurrion un error inesperado",
                    text: `error ${err}`,
                    icon: "error"
                }
            });
        } else {
            res.status(200).json({
                data: null,
                message: {
                    title: "Sub Categoría agregada con éxito",
                    text: "Se ha agregado con éxito la sub categoría",
                    icon: "success"
                }
            });
        }
    });
}

servicesController.editVideo = async (req, res) => {
    let dataForm = req.body;
    
    mysql.query(`UPDATE categories_sub SET name = '${dataForm.name}' WHERE Id = '${dataForm.id}'`, 
    function (err) 
    {
        if (err) {
            res.status(500).json({
                data: null,
                message: {
                    title: "Ocurrion un error inesperado",
                    text: `error ${err}`,
                    icon: "error"
                }
            });
        } else {
            res.status(200).json({
                data: null,
                message: {
                    title: "Sub Categoría editada con éxito",
                    text: "Se ha editado con éxito la sub categoría",
                    icon: "success"
                }
            });
        }
    });
}

servicesController.deleteVideo = async (req, res) => {
    try {
        let dataForm = req.body;

        validateDataState(dataForm.id)
        .then((responseValidate) => {
            if (responseValidate) {
                updateDataState(dataForm.id)
                .then((responseUpdate) => {
                    res.status(200).json(responseUpdate);
                })
                .catch((error) => { 
                    res.status(500).json(error);
                });
            } else {
                deleteData(dataForm.id)
                .then((responseDelete) => {
                    res.status(200).json(responseDelete);
                })
                .catch((error) => { 
                    res.status(500).json(error);
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                data: null,
                message: {
                    title: "Ocurrion un error inesperado",
                    text: `error ${err}`,
                    icon: "error"
                }
            });
        });
    } 
    catch (error) {
        res.status(500).json({
            data: null,
            message: {
                title: "Ocurrion un error inesperado",
                text: `error ${err}`,
                icon: "error"
            }
        });
    }
}

function validateDataState(id) {
    return new Promise((resolve, reject) => {
         mysql.query(`SELECT * FROM categories_sub AS ct 
                WHERE ct.id = ${id}`, 
        //  mysql.query(`SELECT * FROM categories_sub AS ct 
        //         INNER JOIN categories_sub AS cs ON cs.id_category = ct.id 
        //         WHERE ct.id = ${id}`, 
        function (err, result) 
        {
            if (err) {
                return reject(err);
            }
            if (result?.length) {
                return resolve(true);
            } else {
                return resolve(false);
            }
        });
    });
}

function deleteData(id) {
    return new Promise((resolve, reject) => {
        mysql.query(`DELETE FROM categories_sub WHERE id = ${id}`, 
        function (err, result) 
        {
            if (err) {
                reject({
                    data: null,
                    message: {
                        title: "Ocurrion un error inesperado",
                        text: `error ${err}`,
                        icon: "error"
                    }
                });
            } else {
                resolve({
                        data: null,
                        message: {
                            title: "Sub Categoría elimminada con éxito",
                            text: "Se ha eliminado con éxito la sub categoría",
                            icon: "success"
                        }
                    }
                );
            }
        });
    });
}

function updateDataState(id) {
    return new Promise((resolve, reject) => {
        mysql.query(`UPDATE categories_sub SET disable = 1 WHERE id = ${id}`, 
        function (err, result) 
        {
            if (err) {
                reject({
                        data: null,
                        message: {
                            title: "Ocurrion un error inesperado",
                            text: `error ${err}`,
                            icon: "error"
                        }
                    }
                );
            } else {
                resolve({
                        data: null,
                        message: {
                            title: "Sub Categoría eliminada con éxito",
                            text: "Se ha eliminado con éxito la sub categoría",
                            icon: "success"
                        }
                    }
                );
            }
        });
    });
}

module.exports = servicesController;