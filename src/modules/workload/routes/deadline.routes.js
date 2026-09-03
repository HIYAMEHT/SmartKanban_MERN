const express = require("express");

const router = express.Router();
const authMiddleware = require("../../../middlewares/auth.middleware");
router.use(authMiddleware);
const validate = require("../../../middlewares/validate");
const {getDeadlinePredictionSchema} = require("../validate/deadline.validate");
const deadlineController = require("../controllers/deadline.controller");

router.get("/:taskId", validate(getDeadlinePredictionSchema),deadlineController.getDeadlinePrediction);

module.exports = router;