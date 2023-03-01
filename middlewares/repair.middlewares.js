const Repair = require("../models/repair.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");



exports.validIfExistRepair = catchAsync(async (req, res, next) => {

    // OBTENEMOS ID DE LA REQ PARAMS
    const { id } = req.params;

    // BUSCAR EL USUARIO DE FORMA INDIVIDUAL
    const repair = await Repair.findOne({
        where: {
            // id:id,
            id,
            status: "pending",
        },
    });

    // SI NO EXISTE ENVIAMOS UN ERROR
    if (!repair) {
        return next(new AppError('Repair was not found', 404));
    }

    req.repair = repair;
    next();

})