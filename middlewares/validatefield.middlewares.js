const { validationResult } = require("express-validator");

// Validar los campos que reciben excepciones
exports.validateFields = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            errors: errors.mapped()
        })
    }

    next();
};