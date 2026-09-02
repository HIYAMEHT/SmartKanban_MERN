/**
 * Centralized Socket.IO event names for the SmartKanban real-time module.
 *
 * Keeping all event strings in one place prevents mismatch bugs between
 * backend emitters and frontend listeners. This makes the event contract
 * easier to maintain and reduces the chance of typos across the project.
 */

const EVENT_TYPES = {
  TASK_ASSIGNED: 'task:assigned',
  TASK_STATUS_CHANGED: 'task:statusChanged',
  TASK_UPDATED: 'task:updated',
  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',
  ACTIVITY_NEW: 'activity:new',
  COMMENT_CREATED: 'comment:created',
  COMMENT_UPDATED: 'comment:updated',
  COMMENT_DELETED: 'comment:deleted',
};

module.exports = {
  EVENT_TYPES,
};
