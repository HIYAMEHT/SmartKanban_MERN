const asyncHandler = require("../../utils/asyncHandler");
const { OK } = require("../../utils/httpStatus");
const timerService = require("./timeTracking.service") ;
const startTimerController = asyncHandler(async (req,res)=>{
     // get taskId from request
     const {taskId} = req.body ;
    // get userId from authenticated user
    const userId = req.user._id ;
    // call startTimer()
    const timeLog =await timerService.startTimer(userId,taskId) ;
    // send response
    res.status(OK).json(timeLog) ;
});
const stopTimerController = asyncHandler(async (res,req)=>{
    const userId = req.user._id ;
    const updatedTimeLog = await timerService.stopTimer(userId) ;
    res.status(OK).json(updatedTimeLog) ;
});

module.exports = {
    startTimerController ,
    stopTimerController
}
