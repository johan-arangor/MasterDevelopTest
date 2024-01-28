const {response} = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res = response, next) => {
    // X-TOKEN HEADERS
    const token = req.header('access-token');

    if (!token) {
        return res.status(401)
            .json({
                message: 'No hay token en la petición'
            });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.SECRETORPRIVATEKEY
        );
    } 
    catch (error) {
        return res.status(401)
            .json({
                message: 'Token no válido'
            });
    }
    next();
}

module.exports = { validateJWT }