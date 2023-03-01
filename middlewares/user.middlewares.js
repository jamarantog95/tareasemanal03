const User = require("../models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require('util');
const jwt = require("jsonwebtoken");



exports.validIfExistUser = catchAsync(async (req, res, next) => {

    // OBTENEMOS ID DE LA REQ PARAMS
    const { id } = req.params;

    // BUSCAR EL USUARIO DE FORMA INDIVIDUAL
    const user = await User.findOne({
        attributes: ['id', 'name', 'email'],
        where: {
            // id:id,
            id,
            status: "available",
        },
    });

    // SI NO EXISTE ENVIAMOS UN ERROR
    if (!user) {
        return next(new AppError('User was not found', 404));
    }

    req.user = user;
    next();

});



exports.validIfExistUserEmail = catchAsync(async (req, res, next) => {

    // 1. OBTENEMOS ID DE LA REQ BODY
    const { email } = req.body;

    // 3. BUSCAR EL USUARIO INDIVIDUAL
    const user = await User.findOne({
        where: {
            // id:id,
            email: email.toLowerCase(),
        },
    });

    if (user && !user.status) {
        // LO QUE SE DBERIA HACER ES UN UPDATE A TRUE AL ESTADO DE LA CUENTA
        return next(new AppError('The user has an account, but it is deactivated, please contact the administrator.', 404));
    }

    if (user) {
        return next(new AppError('The email user already exists.', 404));
    }

    next();

})


exports.protect = catchAsync(async (req, res, next) => {

    // OBTENER TOKEN Y COMPROBAR SI ESTA ALLI
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }

    // Si el token no existe || no se encuentra
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access', 401));
    }

    // VERIFICACION DEL TOKEN
    const decoded = await promisify(jwt.verify)(
        token,
        process.env.SECRET_JWT_SEED
    );

    // VALIDAR EL USUARIO EXISTENTE
    const user = await User.findOne({
        where: {
            id: decoded.id,
            status: 'available',
        }
    })

    if (!user) {
        return next(new AppError('The owner of this token it not longer available', 401));
    }


    // Valldamos que exista esta propiedad
    if (user.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            user.passwordChangedAt.getTime() / 1000, 10
        );

        // Verificamos  que el tiempo en que se creo el token es menor al tiempo que se cambio la contraseña
        if (decoded.iat < changedTimeStamp) {
            return next(new AppError('User recently changed password, please login again', 401));
        }
    }
    // console.log(decoded.iat);
    // console.log(user.passwordChangedAt.getTime());

    req.sessionUser = user;
    next();
});



exports.protectAccountOwner = catchAsync(async (req, res, next) => {
    //Validamos el usuario y su session que obtenemos de las REQ
    const { user, sessionUser } = req;

    console.log(user.id, sessionUser.id);
    if (user.id !== sessionUser.id) {
        return next(new AppError('You do not own this account'))
    }

    next();
})


// VALIDAMOS LOS ROLES DE ACCESO
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.sessionUser.role)) {
            return next(
                new AppError('You do not have permission to perform this action!', 403)
            );
        }

        next();
    };
};