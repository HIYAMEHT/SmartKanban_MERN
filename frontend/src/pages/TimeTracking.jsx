import React, { useEffect, useState } from "react";

import { timeTrackingApi } from "../api/timeTracking.api";
import { analyticsApi } from "../api/analytics.api";
import { projectApi } from "../api/project.api";
import { taskApi } from "../api/task.api";

import { Loader } from "../components/common/Loader";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";

import { Clock, Play, Square } from "lucide-react";

export const TimeTracking = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const [taskTimeLogs, setTaskTimeLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);

  const [error, setError] = useState(null);

  const [activeTimer, setActiveTimer] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [submitting, setSubmitting] = useState(false);

  // =====================================================
  // RESPONSE HELPERS
  // =====================================================

  const extractData = (response) => {
    if (!response) {
      return null;
    }

    let data = response;

    // Axios response
    if (data?.data !== undefined) {
      data = data.data;
    }

    // ApiResponse wrapper
    if (
      data &&
      typeof data === "object" &&
      data.data !== undefined
    ) {
      data = data.data;
    }

    return data;
  };

  const extractArray = (response) => {
    const data = extractData(response);

    if (Array.isArray(data)) {
      return data;
    }

    if (data && typeof data === "object") {
      if (Array.isArray(data.tasks)) {
        return data.tasks;
      }

      if (Array.isArray(data.projects)) {
        return data.projects;
      }

      if (Array.isArray(data.results)) {
        return data.results;
      }
    }

    return [];
  };

  // =====================================================
  // LOAD ACTIVE TIMER
  // =====================================================

  const loadActiveTimer = async () => {
    try {
      const response =
        await timeTrackingApi.getActiveTimer();

      console.log("ACTIVE TIMER RESPONSE:", response);

      const timer = extractData(response);

      console.log("ACTIVE TIMER DATA:", timer);

      if (!timer) {
        setActiveTimer(null);
        setElapsedSeconds(0);
        return;
      }

      setActiveTimer(timer);

      // Backend uses startTime
      if (timer.startTime) {
        const startTime =
          new Date(timer.startTime).getTime();

        const now = Date.now();

        const seconds = Math.max(
          0,
          Math.floor(
            (now - startTime) / 1000
          )
        );

        setElapsedSeconds(seconds);
      }

      // Get active task ID
      const activeTaskId =
        timer.task?._id ||
        timer.taskId ||
        timer.task;

      if (activeTaskId) {
        setSelectedTaskId(
          String(activeTaskId)
        );
      }
    } catch (err) {
      // No active timer
      if (err.response?.status === 404) {
        setActiveTimer(null);
        setElapsedSeconds(0);
        return;
      }

      console.error(
        "Failed to load active timer:",
        err
      );
    }
  };

  // =====================================================
  // LOAD ANALYTICS
  // =====================================================

  const loadAnalytics = async () => {
    try {
      const response =
        await analyticsApi.getTaskTimeAnalytics();

      const analytics =
        extractArray(response);

      console.log(
        "TIME ANALYTICS:",
        analytics
      );

      setTaskTimeLogs(analytics);
    } catch (err) {
      console.error(
        "Failed to load analytics:",
        err
      );
    }
  };

  // =====================================================
  // LOAD PROJECT TASKS
  // =====================================================

  const loadProjectTasks = async (projectId) => {
    if (!projectId) {
      setTasks([]);
      return;
    }

    try {
      setTasksLoading(true);

      const response =
        await taskApi.getProjectTasks(projectId);

      console.log(
        "PROJECT TASK RESPONSE:",
        response
      );

      const fetchedTasks =
        extractArray(response);

      console.log(
        "TASKS:",
        fetchedTasks
      );

      setTasks(fetchedTasks);

      // Active task
      const activeTaskId =
        activeTimer?.task?._id ||
        activeTimer?.taskId ||
        activeTimer?.task;

      if (activeTaskId) {
        const activeTaskExists =
          fetchedTasks.some(
            (task) =>
              String(task._id) ===
              String(activeTaskId)
          );

        if (activeTaskExists) {
          setSelectedTaskId(
            String(activeTaskId)
          );

          return;
        }
      }

      // Selected task
      const selectedTaskExists =
        fetchedTasks.some(
          (task) =>
            String(task._id) ===
            String(selectedTaskId)
        );

      if (!selectedTaskExists) {
        setSelectedTaskId("");
      }
    } catch (err) {
      console.error(
        "Failed to load project tasks:",
        err
      );

      setTasks([]);

      throw err;
    } finally {
      setTasksLoading(false);
    }
  };

  // =====================================================
  // LOAD PROJECTS
  // =====================================================

  const loadProjects = async () => {
    const response =
      await projectApi.getProjects();

    const fetchedProjects =
      extractArray(response);

    console.log(
      "PROJECTS:",
      fetchedProjects
    );

    setProjects(fetchedProjects);

    if (fetchedProjects.length === 0) {
      setSelectedProjectId("");
      setTasks([]);
      return;
    }

    const firstProject =
      fetchedProjects[0];

    const firstProjectId =
      firstProject._id ||
      firstProject.id;

    setSelectedProjectId(
      firstProjectId
    );

    await loadProjectTasks(
      firstProjectId
    );
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // IMPORTANT:
      // Load active timer first
      await loadActiveTimer();

      await Promise.all([
        loadAnalytics(),
        loadProjects(),
      ]);
    } catch (err) {
      console.error(
        "Failed to load time tracking:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load time tracking data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =====================================================
  // LIVE TIMER
  // =====================================================

  useEffect(() => {
    if (!activeTimer) {
      setElapsedSeconds(0);
      return;
    }

    const updateElapsedTime = () => {
      if (!activeTimer.startTime) {
        return;
      }

      const startTime =
        new Date(
          activeTimer.startTime
        ).getTime();

      const now = Date.now();

      const seconds = Math.max(
        0,
        Math.floor(
          (now - startTime) / 1000
        )
      );

      setElapsedSeconds(seconds);
    };

    // Update immediately
    updateElapsedTime();

    // Update every second
    const interval = setInterval(
      updateElapsedTime,
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [activeTimer]);

  // =====================================================
  // PROJECT CHANGE
  // =====================================================

  const handleProjectChange = async (e) => {
    const projectId =
      e.target.value;

    // Don't switch project while timer runs
    if (activeTimer) {
      return;
    }

    setSelectedProjectId(projectId);
    setSelectedTaskId("");
    setTasks([]);

    if (!projectId) {
      return;
    }

    try {
      setError(null);

      await loadProjectTasks(
        projectId
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load project tasks."
      );
    }
  };

  // =====================================================
  // START TIMER
  // =====================================================

  const handleStartTimer = async () => {
    if (!selectedTaskId) {
      alert(
        "Please select a task first."
      );
      return;
    }

    if (activeTimer) {
      alert(
        "A timer is already running. Stop it before starting another timer."
      );
      return;
    }

    try {
      setSubmitting(true);

      console.log(
        "START TIMER TASK ID:",
        selectedTaskId
      );

      const response =
        await timeTrackingApi.startTimer(
          selectedTaskId
        );

      console.log(
        "START TIMER RESPONSE:",
        response
      );

      const timer =
        extractData(response);

      console.log(
        "STARTED TIMER:",
        timer
      );

      /*
        Backend returns TimeLog.
        TimeLog uses startTime.
      */

      if (
        timer &&
        timer.startTime
      ) {
        setActiveTimer(timer);

        const startTime =
          new Date(
            timer.startTime
          ).getTime();

        setElapsedSeconds(
          Math.max(
            0,
            Math.floor(
              (Date.now() - startTime) /
                1000
            )
          )
        );
      } else {
        await loadActiveTimer();
      }
    } catch (err) {
      console.error(
        "Failed to start timer:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to start timer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // STOP TIMER
  // =====================================================

  const handleStopTimer = async () => {
    if (!activeTimer) {
      return;
    }

    try {
      setSubmitting(true);

      console.log(
        "STOPPING TIMER"
      );

      await timeTrackingApi.stopTimer();

      // Reset frontend timer
      setActiveTimer(null);
      setElapsedSeconds(0);
      setSelectedTaskId("");

      // Refresh analytics
      await loadAnalytics();

      // Refresh tasks
      if (selectedProjectId) {
        await loadProjectTasks(
          selectedProjectId
        );
      }
    } catch (err) {
      console.error(
        "Failed to stop timer:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to stop timer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // FORMAT TIMER
  // =====================================================

  const formatSeconds = (seconds) => {
    const hours =
      Math.floor(
        seconds / 3600
      );

    const minutes =
      Math.floor(
        (seconds % 3600) / 60
      );

    const secs =
      seconds % 60;

    return (
      `${String(hours).padStart(
        2,
        "0"
      )}:` +
      `${String(minutes).padStart(
        2,
        "0"
      )}:` +
      `${String(secs).padStart(
        2,
        "0"
      )}`
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Loader
        message="Loading time tracking system..."
      />
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadData}
      />
    );
  }

  // =====================================================
  // ACTIVE TASK
  // =====================================================

  const activeTaskId =
    activeTimer?.task?._id ||
    activeTimer?.taskId ||
    activeTimer?.task;

  const activeTask =
    tasks.find(
      (task) =>
        String(task._id) ===
        String(activeTaskId)
    );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.75rem",
      }}
    >
      {/* =================================================
          PROJECT
      ================================================= */}

      <div className="card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                marginBottom: "0.25rem",
              }}
            >
              Time Tracking
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "0.85rem",
              }}
            >
              Select a project and track
              time against its tasks.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <label
              style={{
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              Project:
            </label>

            <select
              className="form-select"
              style={{
                width: "250px",
              }}
              value={selectedProjectId}
              onChange={
                handleProjectChange
              }
              disabled={!!activeTimer}
            >
              <option value="">
                -- Select Project --
              </option>

              {projects.map(
                (project) => (
                  <option
                    key={
                      project._id ||
                      project.id
                    }
                    value={
                      project._id ||
                      project.id
                    }
                  >
                    {project.name}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {/* =================================================
          TIMER
      ================================================= */}

      <div
        className="card"
        style={{
          background: activeTimer
            ? "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)"
            : "#ffffff",

          color: activeTimer
            ? "#ffffff"
            : "#0f172a",

          padding: "1.75rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          {/* LEFT */}

          <div>
            <span
              style={{
                fontSize: "0.8rem",
                opacity: 0.85,
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Real-time Task Timer
            </span>

            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginTop: "0.2rem",
              }}
            >
              {activeTimer
                ? "Timer Active"
                : "Start Time Tracking"}
            </h2>

            <p
              style={{
                fontSize: "0.875rem",
                opacity: 0.9,
                marginTop: "0.2rem",
              }}
            >
              {activeTimer
                ? `Currently tracking ${
                    activeTask?.title ||
                    "selected task"
                  }`
                : "Select a task below to start tracking."}
            </p>
          </div>

          {/* RIGHT */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              flexWrap: "wrap",
            }}
          >
            {/* TIMER */}

            <div
              style={{
                textAlign: "right",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  opacity: 0.8,
                  textTransform: "uppercase",
                }}
              >
                Elapsed Duration
              </span>

              <div
                style={{
                  fontSize: "2rem",
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              >
                {formatSeconds(
                  elapsedSeconds
                )}
              </div>
            </div>

            {/* CONTROLS */}

            {activeTimer ? (
              <button
                onClick={
                  handleStopTimer
                }
                className="btn btn-danger"
                disabled={submitting}
              >
                <Square size={18} />

                {submitting
                  ? "Saving..."
                  : "Stop & Save"}
              </button>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                {/* TASK SELECT */}

                <select
                  className="form-select"
                  style={{
                    width: "280px",
                  }}
                  value={
                    selectedTaskId
                  }
                  onChange={(e) =>
                    setSelectedTaskId(
                      e.target.value
                    )
                  }
                  disabled={
                    tasksLoading ||
                    !selectedProjectId
                  }
                >
                  <option value="">
                    {tasksLoading
                      ? "Loading tasks..."
                      : !selectedProjectId
                      ? "Select project first"
                      : tasks.length === 0
                      ? "No tasks available"
                      : "-- Choose Task --"}
                  </option>

                  {tasks.map(
                    (task) => (
                      <option
                        key={task._id}
                        value={task._id}
                      >
                        {task.title}
                      </option>
                    )
                  )}
                </select>

                {/* START BUTTON */}

                <button
                  onClick={
                    handleStartTimer
                  }
                  className="btn btn-primary"
                  disabled={
                    submitting ||
                    !selectedTaskId ||
                    tasksLoading
                  }
                >
                  <Play size={18} />

                  {submitting
                    ? "Starting..."
                    : "Start Timer"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          NO TASKS
      ================================================= */}

      {selectedProjectId &&
        !tasksLoading &&
        tasks.length === 0 && (
          <EmptyState
            title="No tasks found"
            description="This project does not have any tasks yet."
          />
        )}

      {/* =================================================
          ANALYTICS
      ================================================= */}

      <div className="card">
        <div className="card-header">
          <h3
            className="card-title"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Clock
              size={20}
              color="#4f46e5"
            />

            Logged Task Time Overview
          </h3>
        </div>

        {taskTimeLogs.length === 0 ? (
          <EmptyState
            title="No time logs recorded yet"
            description="Start and stop timers on your tasks to record time."
          />
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Estimated Hours</th>
                  <th>Actual Tracked Hours</th>
                  <th>Difference</th>
                </tr>
              </thead>

              <tbody>
                {taskTimeLogs.map(
                  (log, index) => {
                    const estimated =
                      Number(
                        log.estimatedHours
                      ) || 0;

                    const actual =
                      Number(
                        log.actualHours
                      ) || 0;

                    const difference =
                      Number(
                        log.differenceHours
                      ) || 0;

                    return (
                      <tr
                        key={
                          log.taskId ||
                          log._id ||
                          index
                        }
                      >
                        <td
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          {log.title ||
                            "Task"}
                        </td>

                        <td>
                          {estimated} hrs
                        </td>

                        <td
                          style={{
                            fontWeight: 600,
                            color: "#4f46e5",
                          }}
                        >
                          {actual.toFixed(
                            2
                          )}{" "}
                          hrs
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              difference > 0
                                ? "badge-high"
                                : "badge-completed"
                            }`}
                          >
                            {difference > 0
                              ? `+${difference.toFixed(
                                  2
                                )} hrs`
                              : `${difference.toFixed(
                                  2
                                )} hrs`}
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};