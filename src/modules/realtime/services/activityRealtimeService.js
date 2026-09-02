const { EVENT_TYPES } = require('../events/eventTypes');

function buildProjectRoom(projectId) {
  if (typeof projectId !== 'string' || !projectId.trim()) {
    return null;
  }

  return `project:${projectId.trim()}`;
}

function emitActivityNew(io, payload = {}) {
  if (!io || typeof io.to !== 'function') {
    throw new Error('emitActivityNew requires a valid Socket.IO server instance.');
  }

  const { projectId, activityId, userId, action, entityType, entityId, metadata } = payload || {};

  if (typeof projectId !== 'string' || !projectId.trim()) {
    throw new Error('emitActivityNew requires a valid projectId in the payload.');
  }

  if (!activityId) {
    throw new Error('emitActivityNew requires an activityId in the payload.');
  }

  const room = buildProjectRoom(projectId);
  const eventPayload = {
    projectId: projectId.trim(),
    activityId,
    userId,
    action,
    entityType,
    entityId,
    metadata,
    timestamp: new Date().toISOString(),
  };

  io.to(room).emit(EVENT_TYPES.ACTIVITY_NEW, eventPayload);
}

module.exports = {
  emitActivityNew,
};
