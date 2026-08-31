const apiError = require('../../utils/apiError') ;
const timeLogModel = require('../timeTracking/timeTracking.model')
const Task = require("../task/task.model");
const {CONFLICT, NOT_FOUND} = require('../../utils/httpStatus');

const startTimer = async(userId,taskId) => {
    //why we are using userId not taskId bc => a person cannot have multiple timers 
   const ExistingTimer = await timeLogModel.findOne({user : userId, status : 'Running'}) ;
    if(ExistingTimer){
        return apiError(CONFLICT,"The timer is already running for a task") 
    }
    //find if the task really exists 
    const taskExist = await taskModel.findById(taskId) ;
    if(!taskExist){
        return apiError(NOT_FOUND,"Task not found") ;
    }
    //create the timer log 

    const timeLog = await Task.create({
        user : userId ,
        task : taskId,
        startTime :new Date(), //how to find the current tiem 
        durationSeconds : 0 ,
        status : 'Running'
    })
    return timeLog ;
}

module.exports = {startTimer} ;