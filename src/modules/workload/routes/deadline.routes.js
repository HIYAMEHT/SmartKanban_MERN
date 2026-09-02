const express = require("express");

const router = express.Router();
const validate = require("../../../middlewares/validate");
const {getDeadlinePredictionSchema} = require("../validate/deadline.validate");
const deadlineController = require("../controllers/deadline.controller");

router.get("/:taskId", validate(getDeadlinePredictionSchema),deadlineController.getDeadlinePrediction);

module.exports = router;