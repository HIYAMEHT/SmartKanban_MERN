const express = require("express");

const router = express.Router();
const authMiddleware = require("../../../middlewares/auth.middleware");
router.use(authMiddleware);

const workloadController = require("../controllers/workload.controller");
const validate = require("../../../middlewares/validate");
const {getMemberWorkloadSchema , getProjectWorkloadSchema} = require("../validate/workload.validate");
router.get(
  "/project/:projectId",
  validate(getProjectWorkloadSchema),
  workloadController.getProjectWorkload
);

router.get(
  "/member/:userId",validate(getMemberWorkloadSchema),
  workloadController.getMemberWorkload
);

router.get(
  "/overloaded",
  workloadController.getOverloadedMembers
);

module.exports = router;