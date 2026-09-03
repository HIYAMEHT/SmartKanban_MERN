import React, { useEffect, useState } from "react";
import { taskApi } from "../api/task.api";
import { projectApi } from "../api/project.api";
import { Loader } from "../components/common/Loader";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import { Modal } from "../components/common/Modal";
import {
  Search,
  Filter,
  Trash2,
  Edit,
  User,
} from "lucide-react";

export const Tasks = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    priority: "Medium",
    status: "To Do",
    estimatedHours: 0,
  });

  const [submitting, setSubmitting] = useState(false);

  // =========================================================
  // NORMALIZE API RESPONSE
  // =========================================================

  const extractArray = (response, possibleKeys = []) => {
    const data = response?.data;

    // API returned array directly
    if (Array.isArray(data)) {
      return data;
    }

    // API returned:
    // { data: { tasks: [...] } }
    if (data && typeof data === "object") {
      for (const key of possibleKeys) {
        if (Array.isArray(data[key])) {
          return data[key];
        }
      }
    }

    return [];
  };

  // =========================================================
  // FETCH PROJECTS + FIRST PROJECT TASKS
  // =========================================================

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await projectApi.getProjects();

      console.log("PROJECT API RESPONSE:", response.data);

      const fetchedProjects = extractArray(response, [
        "projects",
        "data",
        "results",
      ]);

      setProjects(fetchedProjects);

      if (fetchedProjects.length === 0) {
        setSelectedProjectId("");
        setTasks([]);
        return;
      }

      const firstProjectId = fetchedProjects[0]._id;

      setSelectedProjectId(firstProjectId);

      await fetchProjectTasks(firstProjectId);
    } catch (err) {
      console.error("Failed to load task manager:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch tasks data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH TASKS FOR PROJECT
  // =========================================================

  const fetchProjectTasks = async (projectId) => {
    if (!projectId) {
      setTasks([]);
      return;
    }

    try {
      const response = await taskApi.getProjectTasks(projectId);

      console.log("TASK API RESPONSE:", response.data);

      const fetchedTasks = extractArray(response, [
        "tasks",
        "data",
        "results",
      ]);

      setTasks(fetchedTasks);
    } catch (err) {
      console.error("Failed to fetch project tasks:", err);

      setTasks([]);

      throw err;
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchInitialData();
  }, []);

  // =========================================================
  // PROJECT SELECT
  // =========================================================

  const handleProjectSelect = async (projectId) => {
    setSelectedProjectId(projectId);

    if (!projectId) {
      setTasks([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await fetchProjectTasks(projectId);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const handleOpenEdit = (task) => {
    setEditingTask(task);

    setEditForm({
      title: task.title || "",
      priority: task.priority || "Medium",
      status: task.status || "To Do",
      estimatedHours: task.estimatedHours ?? 0,
    });

    setIsEditModalOpen(true);
  };

  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================

  const handleCloseEdit = () => {
    if (submitting) return;

    setIsEditModalOpen(false);
    setEditingTask(null);

    setEditForm({
      title: "",
      priority: "Medium",
      status: "To Do",
      estimatedHours: 0,
    });
  };

  // =========================================================
  // UPDATE TASK
  // =========================================================

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    if (!editingTask) {
      return;
    }

    if (!editForm.title.trim()) {
      alert("Task title is required.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title: editForm.title.trim(),
        priority: editForm.priority,
        status: editForm.status,
        estimatedHours: Number(editForm.estimatedHours) || 0,
      };

      console.log("UPDATE TASK PAYLOAD:", payload);

      await taskApi.updateTask(editingTask._id, payload);

      handleCloseEdit();

      await fetchProjectTasks(selectedProjectId);
    } catch (err) {
      console.error("Failed to update task:", err);

      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to update task."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // DELETE TASK
  // =========================================================

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Delete this task permanently?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await taskApi.deleteTask(taskId);

      await fetchProjectTasks(selectedProjectId);
    } catch (err) {
      console.error("Failed to delete task:", err);

      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete task."
      );
    }
  };

  // =========================================================
  // FILTER TASKS
  // =========================================================

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((task) => {
        const title = String(task.title || "");

        const matchesSearch = title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "ALL" ||
          task.status === statusFilter;

        const matchesPriority =
          priorityFilter === "ALL" ||
          task.priority === priorityFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority
        );
      })
    : [];

  // =========================================================
  // LOADING
  // =========================================================

  if (loading && projects.length === 0) {
    return <Loader message="Fetching task manager..." />;
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={fetchInitialData}
      />
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Task Management
          </h1>

          <p
            style={{
              fontSize: "0.875rem",
              color: "#64748b",
            }}
          >
            Filter, track, and update tasks across your
            projects
          </p>
        </div>

        {/* PROJECT SELECTOR */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <label
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#0f172a",
            }}
          >
            Select Project:
          </label>

          <select
            className="form-select"
            style={{ width: "220px" }}
            value={selectedProjectId}
            onChange={(e) =>
              handleProjectSelect(e.target.value)
            }
          >
            {projects.map((project) => (
              <option
                key={project._id}
                value={project._id}
              >
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* =====================================================
          SEARCH + FILTERS
      ====================================================== */}

      <div
        className="card"
        style={{
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {/* SEARCH */}

        <div
          style={{
            position: "relative",
            flex: 1,
            minWidth: "240px",
          }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />

          <input
            type="text"
            className="form-input"
            style={{
              paddingLeft: "2.35rem",
            }}
            placeholder="Search tasks by title..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        {/* FILTERS */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          {/* STATUS FILTER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Filter
              size={16}
              color="#64748b"
            />

            <span
              style={{
                fontSize: "0.84rem",
                color: "#64748b",
              }}
            >
              Status:
            </span>

            <select
              className="form-select"
              style={{
                padding: "0.35rem 0.6rem",
              }}
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="ALL">
                All Statuses
              </option>

              <option value="To Do">
                To Do
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Review">
                Review
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>
          </div>

          {/* PRIORITY FILTER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span
              style={{
                fontSize: "0.84rem",
                color: "#64748b",
              }}
            >
              Priority:
            </span>

            <select
              className="form-select"
              style={{
                padding: "0.35rem 0.6rem",
              }}
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
            >
              <option value="ALL">
                All Priorities
              </option>

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* =====================================================
          TASK TABLE
      ====================================================== */}

      {loading ? (
        <Loader message="Loading tasks..." />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="Try selecting a different project or clear your filters."
        />
      ) : (
        <div
          className="table-container card"
          style={{ padding: 0 }}
        >
          <table className="table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Est. Hours</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id}>
                  {/* TITLE */}

                  <td style={{ fontWeight: 600 }}>
                    {task.title}
                  </td>

                  {/* STATUS */}

                  <td>
                    <span
                      className={`badge badge-${String(
                        task.status || "To Do"
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {task.status || "To Do"}
                    </span>
                  </td>

                  {/* PRIORITY */}

                  <td>
                    <span
                      className={`badge badge-${String(
                        task.priority || "Medium"
                      ).toLowerCase()}`}
                    >
                      {task.priority || "Medium"}
                    </span>
                  </td>

                  {/* ASSIGNEE */}

                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: "0.85rem",
                      }}
                    >
                      <User
                        size={14}
                        color="#64748b"
                      />

                      <span>
                        {task.assignee?.name ||
                          "Unassigned"}
                      </span>
                    </div>
                  </td>

                  {/* ESTIMATED HOURS */}

                  <td>
                    {task.estimatedHours ?? 0} hrs
                  </td>

                  {/* DEADLINE */}

                  <td>
                    {task.deadline
                      ? new Date(
                          task.deadline
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* ACTIONS */}

                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() =>
                          handleOpenEdit(task)
                        }
                        title="Edit task"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() =>
                          handleDeleteTask(task._id)
                        }
                        style={{
                          color: "#ef4444",
                        }}
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =====================================================
          EDIT TASK MODAL
      ====================================================== */}

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        title="Edit Task Details"
      >
        <form onSubmit={handleUpdateTask}>
          {/* TITLE */}

          <div className="form-group">
            <label className="form-label">
              Title
            </label>

            <input
              type="text"
              className="form-input"
              value={editForm.title}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="grid-2">
            {/* STATUS */}

            <div className="form-group">
              <label className="form-label">
                Status
              </label>

              <select
                className="form-select"
                value={editForm.status}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <option value="To Do">
                  To Do
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Review">
                  Review
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>

            {/* PRIORITY */}

            <div className="form-group">
              <label className="form-label">
                Priority
              </label>

              <select
                className="form-select"
                value={editForm.priority}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    priority: e.target.value,
                  }))
                }
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>
            </div>
          </div>

          {/* ESTIMATED HOURS */}

          <div className="form-group">
            <label className="form-label">
              Estimated Hours
            </label>

            <input
              type="number"
              className="form-input"
              min={0}
              step="0.5"
              value={editForm.estimatedHours}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  estimatedHours: e.target.value,
                }))
              }
            />
          </div>

          {/* MODAL FOOTER */}

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseEdit}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : "Update Task"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};