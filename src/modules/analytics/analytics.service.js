const TimeLog = require("../timeTracking/timeTracking.model");

const getTaskTimeAnalytics = async () => {
  const analytics = await TimeLog.aggregate([
    {
      $match: {
        status: { $in: ["Completed", "Adjusted"] },
      },
    },

    {
      $group: {
        _id: "$task",
        totalDurationSeconds: {
          $sum: "$durationSeconds",
        },
      },
    },

    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "_id",
        as: "task",
      },
    },

    {
      $unwind: "$task",
    },

    {
      $project: {
        _id: 0,
        taskId: "$task._id",
        title: "$task.title",
        estimatedHours: "$task.estimatedHours",

        actualHours: {
          $divide: ["$totalDurationSeconds", 3600],
        },

        differenceHours: {
          $subtract: [
            { $divide: ["$totalDurationSeconds", 3600] },
            "$task.estimatedHours",
          ],
        },
      },
    },
  ]);

  return analytics;
};


const getUserTimeAnalytics = async () => {
  const analytics = await TimeLog.aggregate([
    {
      $match: {
        status: { $in: ["Completed", "Adjusted"] },
      },
    },

    {
      $group: {
        _id: "$user",
        totalDurationSeconds: {
          $sum: "$durationSeconds",
        },
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $unwind: "$user",
    },

    {
      $project: {
        _id: 0,
        userId: "$user._id",
        name: "$user.name",
        totalHours: {
          $divide: ["$totalDurationSeconds", 3600],
        },
      },
    },
  ]);

  return analytics;
};


const getProjectTimeAnalytics = async () => {
  const analytics = await TimeLog.aggregate([
    // 1. Only completed/adjusted time logs
    {
      $match: {
        status: { $in: ["Completed", "Adjusted"] },
      },
    },

    // 2. First calculate actual time for each task
    {
      $group: {
        _id: "$task",
        actualSeconds: {
          $sum: "$durationSeconds",
        },
      },
    },

    // 3. Get task information
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "_id",
        as: "task",
      },
    },

    // 4. Convert task array into an object
    {
      $unwind: "$task",
    },

    // 5. Group tasks by project
    {
      $group: {
        _id: "$task.project",

        estimatedHours: {
          $sum: "$task.estimatedHours",
        },

        actualSeconds: {
          $sum: "$actualSeconds",
        },
      },
    },

    // 6. Get project information
    {
      $lookup: {
        from: "projects",
        localField: "_id",
        foreignField: "_id",
        as: "project",
      },
    },

    // 7. Convert project array into an object
    {
      $unwind: "$project",
    },

    // 8. Final response
    {
      $project: {
        _id: 0,

        projectId: "$project._id",

        projectName: "$project.name",

        estimatedHours: 1,

        actualHours: {
          $divide: ["$actualSeconds", 3600],
        },

        differenceHours: {
          $subtract: [
            { $divide: ["$actualSeconds", 3600] },
            "$estimatedHours",
          ],
        },
      },
    },
  ]);

  return analytics;
};



const getBottleneckAnalytics = async () => {
  const analytics = await TimeLog.aggregate([
    // 1. Only completed/adjusted logs
    {
      $match: {
        status: { $in: ["Completed", "Adjusted"] },
      },
    },

    // 2. Calculate actual time for each task
    {
      $group: {
        _id: "$task",
        actualSeconds: {
          $sum: "$durationSeconds",
        },
      },
    },

    // 3. Get task information
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "_id",
        as: "task",
      },
    },

    // 4. Convert task array into an object
    {
      $unwind: "$task",
    },

    // 5. Convert seconds into hours
    {
      $addFields: {
        actualHours: {
          $divide: ["$actualSeconds", 3600],
        },
      },
    },

    // 6. Ignore tasks with no estimated time
    //    and find tasks that exceeded estimate by 20%
    {
      $match: {
        $expr: {
          $and: [
            {
              $gt: ["$task.estimatedHours", 0],
            },
            {
              $gt: [
                "$actualHours",
                {
                  $multiply: ["$task.estimatedHours", 1.2],
                },
              ],
            },
          ],
        },
      },
    },

    // 7. Prepare final response
    {
      $project: {
        _id: 0,

        taskId: "$task._id",

        taskTitle: "$task.title",

        estimatedHours: "$task.estimatedHours",

        actualHours: 1,

        exceededByHours: {
          $subtract: [
            "$actualHours",
            "$task.estimatedHours",
          ],
        },

        exceededByPercentage: {
          $multiply: [
            {
              $divide: [
                {
                  $subtract: [
                    "$actualHours",
                    "$task.estimatedHours",
                  ],
                },
                "$task.estimatedHours",
              ],
            },
            100,
          ],
        },
      },
    },

    // 8. Biggest bottlenecks first
    {
      $sort: {
        exceededByHours: -1,
      },
    },
  ]);

  return analytics;
};

module.exports = {
  getTaskTimeAnalytics,getUserTimeAnalytics,getProjectTimeAnalytics,getBottleneckAnalytics
};