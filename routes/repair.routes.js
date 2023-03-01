// RUTAS : puntos de entrada de la aplicacion

const { Router } = require("express");
const { check } = require("express-validator");
const { findAllRepairs, findRepair, createRepair, deleteRepair, updateRepair } = require("../controllers/repair.controller");
const { validIfExistRepair } = require("../middlewares/repair.middlewares");
const { protect, restrictTo } = require("../middlewares/user.middlewares");
const { validateFields } = require("../middlewares/validatefield.middlewares");
const router = Router();


router.get('/', restrictTo('employee'), findAllRepairs);

router.get('/:id', restrictTo('employee'), validIfExistRepair, findRepair);

// Protejo las rutas posteriores
router.use(protect);

router.post('/', [
    // isEmpty: Valida que no este vacio
    check('date', 'The date must be mandatory').not().isEmpty(),
    check('motorsNumber', 'The motorsNumber must be mandatory').not().isEmpty(),
    check('description', 'The description must be mandatory').not().isEmpty(),

    validateFields,
    restrictTo('employee')
], createRepair);

router.patch('/:id', restrictTo('employee'), validIfExistRepair, updateRepair);

router.delete('/:id', restrictTo('employee'), validIfExistRepair, deleteRepair);


module.exports = {
    repairRouter: router,
}