const apiError = require('../../utils/apiError') ;
const TimeLog = require('../timeTracking/timeTracking.model')
const Task = require("../task/task.model");
const {CONFLICT, NOT_FOUND} = require('../../utils/httpStatus');

const startTimer = async(userId,taskId) => {
    //why we are using userId not taskId bc => a person cannot have multiple timers 
   const ExistingTimer = await TimeLog.findOne({user : userId, status : 'Running'}) ;
    if(ExistingTimer){
        return apiError(CONFLICT,"The timer is already running for a task") 
    }
    //find if the task really exists 
    const taskExist = await Task.findById(taskId) ;
    if(!taskExist){
        return apiError(NOT_FOUND,"Task not found") ;
    }
    //create the timer log 

    const timeLog = await TimeLog.create({
        user : userId ,
        task : taskId,
        startTime :new Date(), //how to find the current tiem 
        durationSeconds : 0 ,
        status : 'Running'
    })
    return timeLog ;
}


const stopTimer = async (userId) => {
   // find running timer
    const runningTimer = await TimeLog.findOne({user:userId,status:'Running'}) ;
    // if not found → error
    if(!runningTimer){
        return apiError(NOT_FOUND,"Running timer for this task is not found") ;
    }   
   // set endTime
   runningTimer.endTime = new Date() ;
   // calculate duration
   runningTimer.durationSeconds = (runningTimer.endTime-runningTimer.startTime)/1000 ;
   // set status
   runningTimer.status = 'Completed'
   // save
   await runningTimer.save() ;
   // return
   return runningTimer ;
}

module.exports = {startTimer,stopTimer} ;