

const { EVENT_TYPES } = require('../events/eventTypes');

function buildProjectRoom(projectId) {
  if (typeof projectId !== 'string' || !projectId.trim()) {
    return null;
  }

  return `project:${projectId.trim()}`;
}

/**
 * Emit a task-assigned event to the project's room.
 *
 * @param {import('socket.io').Server} io
 * @param {object} payload
 * @param {string} payload.projectId
 * @param {string} payload.taskId
 * @param {string} payload.assignedTo
 * @param {string} payload.assignedBy
 * @returns {void}
 */
function emitTaskAssigned(io, payload = {}) {
  if (!io || typeof io.to !== 'function') {
    throw new Error('emitTaskAssigned requires a valid Socket.IO server instance.');
  }

  const { projectId, taskId, assignedTo, assignedBy } = payload || {};

  if (typeof projectId !== 'string' || !projectId.trim()) {
    throw new Error('emitTaskAssigned requires a valid projectId in the payload.');
  }

  if (!taskId) {
    throw new Error('emitTaskAssigned requires a taskId in the payload.');
  }

  const room = buildProjectRoom(projectId);
  const eventPayload = {
    taskId,
    projectId: projectId.trim(),
    assignedTo,
    assignedBy,
    timestamp: new Date().toISOString(),
  };

  io.to(room).emit(EVENT_TYPES.TASK_ASSIGNED, eventPayload);
}

/**
 * Emit a task status change event to the project's room.
 *
 * @param {import('socket.io').Server} io
 * @param {object} payload
 * @param {string} payload.projectId
 * @param {string} payload.taskId
 * @param {string} payload.previousStatus
 * @param {string} payload.newStatus
 * @param {string} payload.changedBy
 * @returns {void}
 */
function emitTaskStatusChanged(io, payload = {}) {
  if (!io || typeof io.to !== 'function') {
    throw new Error('emitTaskStatusChanged requires a valid Socket.IO server instance.');
  }

  const { projectId, taskId, previousStatus, newStatus, changedBy } = payload || {};

  if (typeof projectId !== 'string' || !projectId.trim()) {
    throw new Error('emitTaskStatusChanged requires a valid projectId in the payload.');
  }

  if (!taskId) {
    throw new Error('emitTaskStatusChanged requires a taskId in the payload.');
  }

  const room = buildProjectRoom(projectId);
  const eventPayload = {
    taskId,
    projectId: projectId.trim(),
    previousStatus,
    newStatus,
    changedBy,
    timestamp: new Date().toISOString(),
  };

  io.to(room).emit(EVENT_TYPES.TASK_STATUS_CHANGED, eventPayload);
}

/**
 * Emit a generic task updated event to the project's room.
 *
 * @param {import('socket.io').Server} io
 * @param {object} payload
 * @param {string} payload.projectId
 * @param {string} payload.taskId
 * @param {string} payload.updatedBy
 * @param {object} payload.changes
 * @returns {void}
 */
function emitTaskUpdated(io, payload = {}) {
  if (!io || typeof io.to !== 'function') {
    throw new Error('emitTaskUpdated requires a valid Socket.IO server instance.');
  }

  const { projectId, taskId, updatedBy, changes } = payload || {};

  if (typeof projectId !== 'string' || !projectId.trim()) {
    throw new Error('emitTaskUpdated requires a valid projectId in the payload.');
  }

  if (!taskId) {
    throw new Error('emitTaskUpdated requires a taskId in the payload.');
  }

  const room = buildProjectRoom(projectId);
  const eventPayload = {
    taskId,
    projectId: projectId.trim(),
    updatedBy,
    changes,
    timestamp: new Date().toISOString(),
  };

  io.to(room).emit(EVENT_TYPES.TASK_UPDATED, eventPayload);
}

module.exports = {
  emitTaskAssigned,
  emitTaskStatusChanged,
  emitTaskUpdated,
};
