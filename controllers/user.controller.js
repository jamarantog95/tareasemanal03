
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

const bcrypt = require('bcryptjs');
const generateJWT = require("../utils/jwt");
const AppError = require('../utils/appError');



// OBTENER LA LISTA DE LOS USUARIOS EN LA BASE DE DATOS
exports.findAllUsers = catchAsync(async (req, res) => {

    // BUSCAMOS TODOS LOS USUARIOS CON STATUS AVAILABLE
    const users = await User.findAll({
        where: {
            status: "available",
        }
    });

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The users has been show',
        //Enviamos todos los usuarios
        users,

    });

})


// OBTENER UN SOLO USUARIO DADO UN ID
exports.findUser = catchAsync(async (req, res) => {

    // OBTENEMOS ID DE LA REQ PARAMS
    const { user } = req;

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The user was found successfully.',
        //ENVIAMOS EL USUARIO A CONSULTAR
        user
    });

})


// ACTUALIZAR LOS DATOS DE UN USUARIO DADO UN ID, SOLO PUEDE ACTUALIZAR SU NAME Y EMAIL
exports.updateUser = catchAsync(async (req, res) => {

    // OBTENEMOS ID DE LA REQ PARAMS
    const { user } = req;

    // OBTENER INFORMACION DEL REQ BODY
    const { name, email } = req.body;

    // ACTUALIZAMOS EL USUARIO ENCONTRADO
    const updateUser = await user.update({
        name,
        email,
    });

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The user has been update successfully',

        updateUser,

    });

})


// DESHABILITAR LA CUENTA DE UN USUARIO
exports.deleteUser = catchAsync(async (req, res) => {

    // OBTENEMOS ID DE LA REQ PARAMS
    const { user } = req;

    // ACTUALIZAMOS EL USUARIO ENCONTRADO
    await user.update({
        status: "not available"
    });

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The user has been disabled',
    });
})


// CREAR UN NUEVO USUARIO, SE DEBE PROPORCIONAR POR EL REQ.BODY (NAME, EMAIL, PASSWORD, ROLE), EL ROLE (ROL) PUEDE SER CLIENT O EMPLOYEE
exports.createUser = catchAsync(async (req, res) => {

    // OBTENER INFORMACION  DEL REQ BODY
    const { name, email, password, role = 'user' } = req.body;

    // CREAR UNA INSTANCIA DE LA CLASE USER
    const user = new User({ name, email, password, role });

    // ENCRIPTAR LA CONTRASEÑA
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // GUARDAR EN LA BD CON LAS CONTRASEÑAS ENCRIPTADAS
    await user.save();

    // GENERAR EL JWT
    const token = await generateJWT(user.id);

    // RESPUESTA DEL SERVIDOR
    res.status(201).json({
        status: 'success',
        message: 'User created succesfully',

        token,
        user: {
            id: user.id,
            name: user.name,
            role: user.role,
        }
    });

})


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // REVISAR SI EL USUARIO EXISTE && LA CONTRASEÑA ES CORRECTA
    const user = await User.findOne({
        where: {
            email: email.toLowerCase(),
            status: "available",
        }
    });

    //Valida si el usuario esta activo
    if (!user) {
        return next(new AppError('The user could not be found', 404));
    }

    if (!(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }


    // SI TODO ESTA OK, ENVIAR UN TOKEN AL CLIENTE
    const token = await generateJWT(user.id);

    res.status(200).json({
        status: 'success',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    })
});
