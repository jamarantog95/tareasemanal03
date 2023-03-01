const jwt = require('jsonwebtoken');

const generateJWT = (id) => {

    return new Promise((resolve, reject) => {
        const payload = { id };

        jwt.sign(
            payload,
            process.env.SECRET_JWT_SEED,
            {
                // Tiempo de Duracion del Token
                expiresIn: process.env.JWT_EXPIRE_IN,
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(token);
            }
        );
    })

};

module.exports = generateJWT;