
const Repair = require('../models/repair.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

// OBTENER LA LISTA DE MOTOS PENDIENTES (PENDING) DE REPARAR
exports.findAllRepairs = catchAsync(async (req, res) => {

    // BUSCAMOS TODOS LOS USUARIOS CON STATUS PENDING
    const repairs = await Repair.findAll({
        attributes: ['id', 'date', 'userId'],
        where: {
            status: 'pending',
        },
        include: [
            {
                model: User
            }
        ]
    });


    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        repairs
    });

})


// OBTENER UNA MOTO PENDIENTE DE REPARAR POR SU ID 
exports.findRepair = catchAsync(async (req, res) => {
    // OBTENEMOS ID DE LA REQ PARAMS
    const { repair } = req;

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The repair was found successfully.',
        //Enviamos el repair a consultar
        repair
    });

})


// CREAR UNA CITA, SE DEBE INCLUIR EN EL REQ.BODY LO SIGUIENTE (DATE, USERID) EL USERID SIENDO EL ID DEL USUARIO QUIEN SOLICITA LA REPARACIÓN. 
exports.createRepair = catchAsync(async (req, res) => {

    // OBTENER INFORMACION  DEL REQ BODY
    const { date, motorsNumber, description, userId } = req.body;

    // CREAR UN NUEVA REPARACIÓN
    const newRepair = await Repair.create({
        date,
        motorsNumber,
        description: description.toLowerCase(),
        userId,
    });

    // RESPUESTA DEL SERVID
    res.status(201).json({
        status: 'success',
        message: 'The repair was created. ',

        newRepair,
    });

})


// ACTUALIZAR EL STATUS DE UNA REPARACIÓN HA COMPLETADO (CAMBIAR STATUS A COMPLETED) 
exports.updateRepair = catchAsync(async (req, res) => {

    // OBTENEMOS ID DE LA REQ PARAMS
    const { repair } = req;

    // ACTUALIZAMOS EL ESTADO DEL REPAIR
    await repair.update({
        status: "completed"
    });

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The repair has been completed',
    });

})


// CANCELAR LA REPARACIÓN DE UN USUARIO (CAMBIAR STATUS A CANCELLED) 
exports.deleteRepair = catchAsync(async (req, res) => {

    // OBTENEMOS ID DE LA REQ PARAMS
    const { repair } = req;

    // ACTUALIZAMOS EL ESTADO DEL REPAIR
    await repair.update({
        status: "cancelled"
    });

    // RESPUESTA DEL SERVIDOR
    res.status(200).json({
        status: 'success',
        message: 'The repair has been disabled',
    });

})
