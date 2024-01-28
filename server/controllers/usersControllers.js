const Cryptr = require('cryptr');
const usersController = {};
const mysql = require('../src/middleware/connection');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment'); 
const jwtGenerator = require('../src/middleware/generateJwt');
const transporter = require('../src/middleware/configEmail');
const templateRenewHtml = require('../features/templates/renewPassword.jsx');
require('dotenv').config();

usersController.login = async (req, res) => {
    let dataForm = req.body;

    await ValidateUser(dataForm.user)
        .then(async (validateUser) => {
            if (validateUser.state){
                await Decrypt(validateUser.data.password)
                    .then(async (passwordDecrypt) => {
                        await ValidateCredentials(validateUser.data.id, dataForm.user, dataForm.password, passwordDecrypt)
                            .then((credentials) =>
                                {
                                    res.status(200)
                                    .send(credentials);
                                }
                            )
                            .catch((error) => {
                                res.status(400)
                                .send(error);
                            });
                    })
                    .catch((error) => {
                        res.status(400)
                        .send(error.message);
                    });
            } else {
                res.status(400)
                .send({
                    data: null,
                    message: {
                        title: "Usuario invalido",
                        text: `el usuario ${dataForm.user} no existe`,
                        icon: "error"
                    }
                });
            }
        })
        .catch((error) => {
            res.status(400)
            .send({
                data: null,
                message: {
                    title: "Ocurrio un error inesperado",
                    text: `error: ${error}`,
                    icon: "error"
                }
            });
        });
}

usersController.signup = async (req, res) => {
    let dataForm = req.body;
    
    await ValidateUser(dataForm.user)
        .then(async (validateUser) => {
            if (!validateUser.state){
                await Encrypt(dataForm.password)
                    .then(async (passwordEncrypt) => {
                        await SendEmailConfirm(dataForm.user, passwordEncrypt)
                            .then(() => {
                                res.status(200)
                                .send({
                                    data: null,
                                    message: {
                                        title: "Cuenta creada con exito",
                                        text: `Se ha enviado un email a su correo electronico con un link para confirmar su cuenta`,
                                        icon: "success"
                                    }
                                });
                            })
                            .catch((error) => {
                                res.status(400)                        
                                .send({
                                    data: null,
                                    message: {
                                        title: "Ocurrio un error inesperado",
                                        text: `error: ${error}`,
                                        icon: "error"
                                    }
                                });
                            });
                    })
                    .catch((error) => {
                        res.status(400)                        
                        .send({
                            data: null,
                            message: {
                                title: "Ocurrio un error inesperado",
                                text: `error: ${error}`,
                                icon: "error"
                            }
                        });
                    });
            } else {
                res.status(400)
                .send({
                    data: null,
                    message: {
                        title: "Usuario invalido",
                        text: `el usuario ${dataForm.user} ya existe y no se puede duplicar`,
                        icon: "error"
                    }
                });
            }
        })
        .catch((error) => {
            res.status(400)
            .send({
                data: null,
                message: {
                    title: "Ocurrio un error inesperado",
                    text: `error: ${error}`,
                    icon: "error"
                }
            });
        });
}

usersController.confirmAccount = async (req, res) => {
    await jwtGenerator.decodeJwt(req.params.id)
        .then(async (jwtDecode) => {
            await ValidateUser(jwtDecode.user)
            .then(async (validateUser) => {
                if (!validateUser.state){
                    await CreateUser(uuidv4(), jwtDecode.user, jwtDecode.password)
                        .then((userCreate) => {
                            res.status(200)
                            .send(userCreate);
                        });
                } else {
                    res.status(400)
                    .send({
                        data: null,
                        message: {
                            title: "Usuario invalido",
                            text: `el usuario ${jwtDecode.user} ya existe y no se puede crear`,
                            icon: "error"
                        }
                    });
                }
            })
            .catch((error) => {
                res.status(400)
                .send({
                    data: null,
                    message: {
                        title: "Ocurrio un error inesperado",
                        text: `error: ${error}`,
                        icon: "error"
                    }
                });
            });
        })
        .catch((error) => {
            res.status(400)
            .send(error);
        });
}

usersController.renewPassword = async (req, res) => {
    let dataForm = req.body;
    
    await ValidateUser(dataForm.user)
        .then(async (validateUser) => {
            if (validateUser.state){
                await SendEmailRenew(dataForm.user)
                    .then(() => {
                        res.status(200)
                        .send({
                            data: null,
                            message: {
                                title: "Recuperación de cuenta enviada con exito",
                                text: `Se ha enviado un email a su correo electronico con un link para realizar el cambio de contraseña de su cuenta`,
                                icon: "success"
                            }
                        });
                    })
                    .catch((error) => {
                        res.status(400)                        
                        .send({
                            data: null,
                            message: {
                                title: "Ocurrio un error inesperado",
                                text: `error: ${error}`,
                                icon: "error"
                            }
                        });
                    });
            } else {
                res.status(400)
                .send({
                    data: null,
                    message: {
                        title: "El usuario no existe",
                        text: `el usuario ${dataForm.user} no existe y no se puede enviar el email para recuperar la contraseña`,
                        icon: "error"
                    }
                });
            }
        })
        .catch((error) => {
            res.status(400)
            .send({
                data: null,
                message: {
                    title: "Ocurrio un error inesperado",
                    text: `error: ${error}`,
                    icon: "error"
                }
            });
        });
}

usersController.changePasswordLink = async (req, res) => {
    await jwtGenerator.decodeJwt(req.params.id)
        .then(async () => {
            res.status(200)
            .send();
        })
        .catch((error) => {
            error.message = {
                title: "Token vencido",
                text: `El token ya no está disponible, por favor solicite un nuevo cambio de contraseña`,
                icon: "error"
            };

            res.status(400)
            .send(error);
        });
}

usersController.changePassword = async (req, res) => {
    await jwtGenerator.decodeJwt(req.body.token)
    .then(async (jwtDecode) => {
        await Encrypt(req.body.password)
        .then(async (passwordEncrypt) => {
            await UpdatePasswordUser(jwtDecode.user, passwordEncrypt)
            .then((response) => {
                res.status(200)
                .send(response);
            })
            .catch((error) => {
                res.status(400)
                .send(error);
            });
        })
        .catch((error) => {
            res.status(400)
            .send(error);
        });
    })
    .catch((error) => {
        res.status(400)
        .send(error);
    });
}

async function Encrypt (valueEncrypt) {
    return new Promise((resolve) => {
        let cryptr = new Cryptr(process.env.SECRETORPRIVATEKEY);

        resolve(cryptr.encrypt(valueEncrypt));
    });
}

async function Decrypt (valueEncrypt) {
    return new Promise((resolve) => {
        let cryptr = new Cryptr(process.env.SECRETORPRIVATEKEY);

        resolve(cryptr.decrypt(valueEncrypt));
    });
}

async function ValidateUser(valueUser) {
    return new Promise((resolve, reject) => {
        mysql.query(`SELECT id, password FROM users WHERE user = '${valueUser}'`, 
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
                if (result?.length > 0) {
                    resolve({
                        state: true, 
                        data: {id: result[0].id, password: result[0].password}
                    });
                } else {
                    resolve({state: false});
                }
            }
        });
    });
}

async function CreateUser(uuid, user, passwordEncrypt) {
    return new Promise((resolve, reject) => {
        mysql.query(`INSERT INTO users (id, user, password, dateCreate, lastDate) VALUES ('${uuid}', '${user}', '${passwordEncrypt}', '${moment().format("YYYY-MM-DD")}', '${moment().format("YYYY-MM-DD")}')`, 
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
                        title: "Usuario creado con exito",
                        text: "Se ha creado el usuario correctamente",
                        icon: "success"
                    }
                });
            }
        });
    });
}

async function UpdatePasswordUser(user, passwordEncrypt) {
    return new Promise((resolve, reject) => {
        mysql.query(`UPDATE users SET password = '${passwordEncrypt}' WHERE user = '${user}'`, 
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
                        title: "Contraseña cambiada con exito",
                        text: "Se ha cambiado la contraseña correctamente",
                        icon: "success"
                    }
                });
            }
        });
    });
}

async function ValidateCredentials(id, user, password, passwordEncrypt) {
    return new Promise(async (resolve, reject) => {
        if (password !== passwordEncrypt) {
            reject({
                data: null,
                message: {
                    title: "Credenciales incorrectas",
                    text: `Usuario o contraseña incorrectos`,
                    icon: "error"
                }
            });
        } else {
            let profile = {
                user: user,
            };

            profile.token = await jwtGenerator.generateLogIn({user: user, id: id});

            resolve({
                data: profile,
                message: {
                    title: "Sesión iniciada con exito",
                    text: "Se ha iniciado la sesión correctamente",
                    icon: "success"
                }
            });
        }
    });
}

async function SendEmailConfirm(user, passwordEncrypt){
    let profile = {
        user: user,
        password: passwordEncrypt
    };
    let jwtGenerated = await jwtGenerator.generateSignIn(profile);
    let jwtLink = `${process.env.PATH_LINK}confirmAccount/${jwtGenerated}`;

    try {
        await transporter.sendMail({
            from: {
                name: 'app control cost',
                address: process.env.APP_USER
            },
            to: user,
            subject: 'evio de confirmación',
            html: `
                <!DOCTYPE html>
                <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                    <meta charset="utf-8"> <!-- utf-8 works for most cases -->
                    <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
                    <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
                    <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
                    <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
                </head>
                <body>
                    <br>
                    <h1><a href="${jwtLink}">click para confirmar cuenta</a></h1>
                </body>`
        });
    } catch (error) {
    }
}

async function SendEmailRenew(user){
    let profile = {
        user: user
    };
    let jwtGenerated = await jwtGenerator.generateRenew(profile);
    let jwtLink = `${process.env.PATH_LINK}changePassword/${jwtGenerated}`;
    let messageHtml = templateRenewHtml.renewPasswordHtml(jwtLink);

    try {
        await transporter.sendMail({
            from: {
                name: 'app control cost',
                address: process.env.APP_USER
            },
            to: user,
            subject: 'envío de recuperación de contraseña',
            html: messageHtml
        });
    } catch (error) {
    }
}

module.exports = usersController;