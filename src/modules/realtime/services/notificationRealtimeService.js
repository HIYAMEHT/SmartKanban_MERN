const { EVENT_TYPES } = require('../events/eventTypes');

function buildProjectRoom(projectId) {
  if (typeof projectId !== 'string' || !projectId.trim()) {
    return null;
  }

  return `project:${projectId.trim()}`;
}

function emitNotificationNew(io, payload = {}) {
  if (!io || typeof io.to !== 'function') {
    throw new Error('emitNotificationNew requires a valid Socket.IO server instance.');
  }

  const { projectId, notificationId, recipientId, type, message, data } = payload || {};

  if (typeof projectId !== 'string' || !projectId.trim()) {
    throw new Error('emitNotificationNew requires a valid projectId in the payload.');
  }

  if (!notificationId) {
    throw new Error('emitNotificationNew requires a notificationId in the payload.');
  }

  const room = buildProjectRoom(projectId);
  const eventPayload = {
    projectId: projectId.trim(),
    notificationId,
    recipientId,
    type,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  io.to(room).emit(EVENT_TYPES.NOTIFICATION_NEW, eventPayload);
}

function emitNotificationRead(io, payload = {}) {
  if (!io || typeof io.to !== 'function') {
    throw new Error('emitNotificationRead requires a valid Socket.IO server instance.');
  }

  const { projectId, notificationId, userId } = payload || {};

  if (typeof projectId !== 'string' || !projectId.trim()) {
    throw new Error('emitNotificationRead requires a valid projectId in the payload.');
  }

  if (!notificationId) {
    throw new Error('emitNotificationRead requires a notificationId in the payload.');
  }

  const room = buildProjectRoom(projectId);
  const eventPayload = {
    projectId: projectId.trim(),
    notificationId,
    userId,
    timestamp: new Date().toISOString(),
  };

  io.to(room).emit(EVENT_TYPES.NOTIFICATION_READ, eventPayload);
}

module.exports = {
  emitNotificationNew,
  emitNotificationRead,
};
