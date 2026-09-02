const { EVENT_TYPES } = require('../events/eventTypes');

function buildProjectRoom(projectId) {
  if (typeof projectId !== 'string' || !projectId.trim()) {
    return null;
  }

  return `project:${projectId.trim()}`;
}

function emitCommentCreated(io, payload = {}) {
  if (!io || typeof io.to !== 'function') {
    throw new Error('emitCommentCreated requires a valid Socket.IO server instance.');
  }

  const { projectId, commentId, taskId, userId, content } = payload || {};

  if (typeof projectId !== 'string' || !projectId.trim()) {
    throw new Error('emitCommentCreated requires a valid projectId in the payload.');
  }

  if (!commentId) {
    throw new Error('emitCommentCreated requires a commentId in the payload.');
  }

  const room = buildProjectRoom(projectId);
  const eventPayload = {
    projectId: projectId.trim(),
    commentId,
    taskId,
    userId,
    content,
    timestamp: new Date().toISOString(),
  };

  io.to(room).emit(EVENT_TYPES.COMMENT_CREATED, eventPayload);
}

function emitCommentUpdated(io, payload = {}) {
  if (!io || typeof io.to !== 'function') {
    throw new Error('emitCommentUpdated requires a valid Socket.IO server instance.');
  }

  const { projectId, commentId, taskId, userId, content } = payload || {};

  if (typeof projectId !== 'string' || !projectId.trim()) {
    throw new Error('emitCommentUpdated requires a valid projectId in the payload.');
  }

  if (!commentId) {
    throw new Error('emitCommentUpdated requires a commentId in the payload.');
  }

  const room = buildProjectRoom(projectId);
  const eventPayload = {
    projectId: projectId.trim(),
    commentId,
    taskId,
    userId,
    content,
    timestamp: new Date().toISOString(),
  };

  io.to(room).emit(EVENT_TYPES.COMMENT_UPDATED, eventPayload);
}

function emitCommentDeleted(io, payload = {}) {
  if (!io || typeof io.to !== 'function') {
    throw new Error('emitCommentDeleted requires a valid Socket.IO server instance.');
  }

  const { projectId, commentId, taskId, userId } = payload || {};

  if (typeof projectId !== 'string' || !projectId.trim()) {
    throw new Error('emitCommentDeleted requires a valid projectId in the payload.');
  }

  if (!commentId) {
    throw new Error('emitCommentDeleted requires a commentId in the payload.');
  }

  const room = buildProjectRoom(projectId);
  const eventPayload = {
    projectId: projectId.trim(),
    commentId,
    taskId,
    userId,
    timestamp: new Date().toISOString(),
  };

  io.to(room).emit(EVENT_TYPES.COMMENT_DELETED, eventPayload);
}

module.exports = {
  emitCommentCreated,
  emitCommentUpdated,
  emitCommentDeleted,
};
