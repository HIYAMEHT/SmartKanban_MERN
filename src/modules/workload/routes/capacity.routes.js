const express = require("express");
const {getMemberCapacitySchema} = require("../validate/capacity.validation");
const router = express.Router();
const authMiddleware = require("../../../middlewares/auth.middleware");
router.use(authMiddleware);
const validate = require("../../../middlewares/validate");
const capacityController = require("../controllers/capacity.controller");

router.get("/:userId",validate(getMemberCapacitySchema), capacityController.getMemberCapacity);

module.exports = router;