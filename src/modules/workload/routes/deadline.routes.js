const express = require("express");

const router = express.Router();
const validate = require("../../../middlewares/validate");
const {getDeadlinePrediction} = require("../validate/deadline.validate");
const deadlineController = require("../controllers/deadline.controller");

router.get("/:taskId", validate(getDeadlinePrediction),deadlineController.getDeadlinePrediction);

module.exports = router;