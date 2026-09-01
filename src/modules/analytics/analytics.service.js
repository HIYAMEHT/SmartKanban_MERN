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

module.exports = {
  getTaskTimeAnalytics,
};