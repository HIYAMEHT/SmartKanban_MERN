
const apiResponse = require("../../../utils/apiResponse");
const asyncHandler = require("../../../utils/asyncHandler");
const { OK } = require("../../../utils/httpStatus");
const workloadService = require("../services/workload.service");

// GET /workload/project/:projectId
const getProjectWorkload = asyncHandler(async (req, res, next) => {
 
    const { projectId } = req.params;

    const data = await workloadService.getProjectWorkload(projectId);

    res.status(OK).json(apiResponse(OK,data,"Project workload fetch successfully"));
 
});

// GET /workload/member/:userId
const getMemberWorkload = asyncHandler(async (req, res, next) => {
 
    const { userId } = req.params;

    const data = await workloadService.getMemberWorkload(userId);

    res.status(OK).json(apiResponse(OK,data,"Member workload fetch successfully"));
 
});

// GET /workload/overloaded
const getOverloadedMembers = asyncHandler(async (req, res, next) => {
 
    const data = await workloadService.getOverloadedMembers();

    res.status(OK).json(apiResponse(OK,data,"Overloaded members fetch successfully"));
 
});

module.exports = {
  getProjectWorkload,
  getMemberWorkload,
  getOverloadedMembers,
};