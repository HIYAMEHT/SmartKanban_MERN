/**
 * Reusable task event service for the SmartKanban real-time collaboration module.
 *
 * This module is intentionally independent from the existing task implementation so
 * teammates can later import and call these functions from their own Task-related
 * controllers without modifying the existing application structure.
 */

const { EVENT_TYPES } = require('../events/eventTypes');

/**
 * Build the project room name used for real-time communication.
 *
 * projectId is required because all task updates are scoped to a project room.
 * Events should be sent only to users who are currently viewing or collaborating in
 * that project, not to unrelated users in other teams or projects.
 *
 * @param {string} projectId
 * @returns {string}
 */
function buildProjectRoom(projectId) {
  return `project:${projectId}`;
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
  const { projectId, taskId, assignedTo, assignedBy } = payload;

  if (!projectId) {
    throw new Error('emitTaskAssigned requires a projectId in the payload.');
  }

  const room = buildProjectRoom(projectId);
  const eventPayload = {
    taskId,
    projectId,
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
  const { projectId, taskId, previousStatus, newStatus, changedBy } = payload;

  if (!projectId) {
    throw new Error('emitTaskStatusChanged requires a projectId in the payload.');
  }

  const room = buildProjectRoom(projectId);
  const eventPayload = {
    taskId,
    projectId,
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
  const { projectId, taskId, updatedBy, changes } = payload;

  if (!projectId) {
    throw new Error('emitTaskUpdated requires a projectId in the payload.');
  }

  const room = buildProjectRoom(projectId);
  const eventPayload = {
    taskId,
    projectId,
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
