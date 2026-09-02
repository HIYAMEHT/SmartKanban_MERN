/**
 * Reusable Socket.IO server initialization for the SmartKanban Real-Time module.
 *
 * This module is intentionally isolated so the team can later attach it to the
 * main application without modifying the existing server code.
 *
 * Usage:
 *   const { initializeRealtime } = require('./realtime/sockets/realtimeSocket');
 *   initializeRealtime(io);
 */

/**
 * Initialize the Socket.IO server and register project-based room handlers.
 *
 * @param {import('socket.io').Server} io - The Socket.IO server instance.
 * @returns {import('socket.io').Server} The same Socket.IO server instance.
 */
function initializeRealtime(io) {
  if (!io || typeof io.on !== 'function') {
    throw new Error('initializeRealtime requires a valid Socket.IO server instance.');
  }

  if (io.__smartkanbanRealtimeInitialized) {
    return io;
  }

  io.__smartkanbanRealtimeInitialized = true;

  io.on('connection', (socket) => {
    // Log each client connection for debugging and monitoring.
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id} | reason: ${reason}`);
    });

    /**
     * Join a project room for real-time updates.
     *
     * Client payload example:
     * {
     *   projectId: "123"
     * }
     *
     * Room name format:
     * project:<projectId>
     */
    socket.on('joinProject', (payload = {}) => {
      const safePayload = payload && typeof payload === 'object' ? payload : {};
      const projectId = safePayload.projectId;

      if (typeof projectId !== 'string' || !projectId.trim()) {
        console.warn('[Socket.IO] joinProject called without a valid projectId');
        return;
      }

      const normalizedProjectId = projectId.trim();
      const roomName = `project:${normalizedProjectId}`;
      socket.join(roomName);

      socket.emit('joinedProject', {
        projectId: normalizedProjectId,
        room: roomName,
        socketId: socket.id,
      });

      console.log(`[Socket.IO] Socket ${socket.id} joined ${roomName}`);
    });

    /**
     * Leave a project room when the user switches projects or disconnects.
     *
     * Client payload example:
     * {
     *   projectId: "123"
     * }
     */
    socket.on('leaveProject', (payload = {}) => {
      const safePayload = payload && typeof payload === 'object' ? payload : {};
      const projectId = safePayload.projectId;

      if (typeof projectId !== 'string' || !projectId.trim()) {
        console.warn('[Socket.IO] leaveProject called without a valid projectId');
        return;
      }

      const normalizedProjectId = projectId.trim();
      const roomName = `project:${normalizedProjectId}`;
      socket.leave(roomName);

      socket.emit('leftProject', {
        projectId: normalizedProjectId,
        room: roomName,
        socketId: socket.id,
      });

      console.log(`[Socket.IO] Socket ${socket.id} left ${roomName}`);
    });
  });

  return io;
}

module.exports = {
  initializeRealtime,
};
