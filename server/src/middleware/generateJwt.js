const jwt = require('jsonwebtoken');
const { stringify } = require('uuid');
require('dotenv').config();

const jwtController = {};

jwtController.generateLogIn = (dataUser) => {
    return generateJWT(dataUser, '2h');
}

jwtController.generateSignIn = (dataUser) => {
    return generateJWT(dataUser, '1d');
}

jwtController.generateRenew = (dataUser) => {
    return generateJWT(dataUser, '10m');
}

jwtController.decodeJwt = (jwtString) => {
    return new Promise((resolve, reject)=> {
        let decodeJWT = jwt.decode(jwtString);

        if (Date.now() >= decodeJWT.exp * 1000) {
            reject({
                data: null,
                message: {
                    title: "Token vencido",
                    text: `El token ya no está disponible, por favor cree una cuenta nueva`,
                    icon: "error"
                }
            });
        } else {
            return resolve(decodeJWT);
        }
    });
}

function generateJWT(data, time) {
    return new Promise((resolve, reject) => {
        let token = jwt.sign(data, 
            process.env.SECRETORPRIVATEKEY , {
            expiresIn: time
        });

        token ? resolve(token) : reject('No se pudo generar el Token');
    });
}

module.exports = jwtController;