const {
  emitTaskAssigned,
  emitTaskStatusChanged,
  emitTaskUpdated,
} = require('./taskRealtimeService');
const {
  emitNotificationNew,
  emitNotificationRead,
} = require('./notificationRealtimeService');
const { emitActivityNew } = require('./activityRealtimeService');
const {
  emitCommentCreated,
  emitCommentUpdated,
  emitCommentDeleted,
} = require('./commentRealtimeService');

const taskEventApi = {
  emitTaskAssigned,
  emitTaskStatusChanged,
  emitTaskUpdated,
  emitNotificationNew,
  emitNotificationRead,
  emitActivityNew,
  emitCommentCreated,
  emitCommentUpdated,
  emitCommentDeleted,
};

module.exports = {
  taskEventApi,
  emitTaskAssigned,
  emitTaskStatusChanged,
  emitTaskUpdated,
  emitNotificationNew,
  emitNotificationRead,
  emitActivityNew,
  emitCommentCreated,
  emitCommentUpdated,
  emitCommentDeleted,
};
