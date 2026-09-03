import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { projectApi } from "../api/project.api";
import { boardApi } from "../api/board.api";
import { workloadApi } from "../api/workload.api";
import { Loader } from "../components/common/Loader";
import { ErrorState } from "../components/common/ErrorState";
import { Modal } from "../components/common/Modal";
import {
  Users,
  KanbanSquare,
  Plus,
  Trash2,
  Calendar,
  UserPlus,
  BarChart2,
} from "lucide-react";

export const ProjectDetails = () => {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [workloadData, setWorkloadData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);

  const [newMemberUserId, setNewMemberUserId] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("member");
  const [newBoardName, setNewBoardName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // LOAD PROJECT DETAILS
  // =========================

  const loadAllDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const results = await Promise.allSettled([
        projectApi.getProjectById(projectId),
        projectApi.getProjectMembers(projectId),
        boardApi.getBoards(),
        workloadApi.getProjectWorkload(projectId),
      ]);

      const [projRes, membersRes, boardsRes, workloadRes] = results;

      // =========================
      // PROJECT
      // =========================

      if (projRes.status === "fulfilled") {
        const response = projRes.value;

        const projectData =
          response?.data?.data ||
          response?.data?.project ||
          response?.data ||
          null;

        setProject(projectData);
      } else {
        throw new Error("Project not found");
      }

      // =========================
      // MEMBERS
      // =========================

      if (membersRes.status === "fulfilled") {
        const response = membersRes.value;

        console.log("MEMBERS API RESPONSE:", response);

        const memberData =
          response?.data?.data ||
          response?.data?.members ||
          response?.data ||
          [];

        // IMPORTANT:
        // Always make sure members is an array
        if (Array.isArray(memberData)) {
          setMembers(memberData);
        } else {
          setMembers([]);
          console.error(
            "Expected members to be an array but received:",
            memberData
          );
        }
      } else {
        setMembers([]);
      }

      // =========================
      // BOARDS
      // =========================

      if (boardsRes.status === "fulfilled") {
        const response = boardsRes.value;

        console.log("BOARDS API RESPONSE:", response);

        const boardData =
          response?.data?.data ||
          response?.data?.boards ||
          response?.data ||
          [];

        if (Array.isArray(boardData)) {
          setBoards(boardData);
        } else {
          setBoards([]);
          console.error(
            "Expected boards to be an array but received:",
            boardData
          );
        }
      } else {
        setBoards([]);
      }

      // =========================
      // WORKLOAD
      // =========================

      if (workloadRes.status === "fulfilled") {
        const response = workloadRes.value;

        const workload =
          response?.data?.data ||
          response?.data ||
          null;

        setWorkloadData(workload);
      } else {
        setWorkloadData(null);
      }
    } catch (err) {
      console.error("Project details error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load project details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadAllDetails();
    }
  }, [projectId]);

  // =========================
  // ADD MEMBER
  // =========================

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!newMemberUserId.trim()) {
      alert("Please enter a user ID.");
      return;
    }

    try {
      setSubmitting(true);

      await projectApi.addMember(projectId, {
        userId: newMemberUserId.trim(),
        role: newMemberRole,
      });

      setIsAddMemberOpen(false);
      setNewMemberUserId("");
      setNewMemberRole("member");

      await loadAllDetails();
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Failed to add member."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // REMOVE MEMBER
  // =========================

  const handleRemoveMember = async (userId) => {
    if (!userId) return;

    if (!window.confirm("Remove this member from the project?")) {
      return;
    }

    try {
      await projectApi.removeMember(projectId, userId);

      await loadAllDetails();
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Failed to remove member."
      );
    }
  };

  // =========================
  // CREATE BOARD
  // =========================

  const handleCreateBoard = async (e) => {
    e.preventDefault();

    if (!newBoardName.trim()) {
      alert("Please enter a board name.");
      return;
    }

    try {
      setSubmitting(true);

      await boardApi.createBoard({
        name: newBoardName.trim(),
        description: `Board for ${project?.name || "Project"}`,
      });

      setIsCreateBoardOpen(false);
      setNewBoardName("");

      await loadAllDetails();
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Failed to create board."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <Loader message="Loading project workspace details..." />
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadAllDetails}
      />
    );
  }

  if (!project) {
    return (
      <ErrorState
        message="Project not found."
        onRetry={loadAllDetails}
      />
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.75rem",
      }}
    >
      {/* =========================
          PROJECT OVERVIEW
      ========================= */}

      <div
        className="card"
        style={{ padding: "1.75rem" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.8rem",
                color: "#4f46e5",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Project Workspace
            </span>

            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "#0f172a",
                marginTop: "0.25rem",
              }}
            >
              {project.name}
            </h1>

            <p
              style={{
                fontSize: "0.95rem",
                color: "#64748b",
                marginTop: "0.35rem",
                maxWidth: "700px",
              }}
            >
              {project.description ||
                "No description available."}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
            }}
          >
            <button
              onClick={() =>
                setIsAddMemberOpen(true)
              }
              className="btn btn-secondary"
            >
              <UserPlus size={16} />
              Add Member
            </button>

            <button
              onClick={() =>
                setIsCreateBoardOpen(true)
              }
              className="btn btn-primary"
            >
              <Plus size={16} />
              Create Board
            </button>
          </div>
        </div>

        {/* INFO */}

        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            marginTop: "1.25rem",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.85rem",
              color: "#64748b",
            }}
          >
            <Calendar size={16} />

            <span>
              Deadline:{" "}
              {project.deadline
                ? new Date(
                    project.deadline
                  ).toLocaleDateString()
                : "Not set"}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.85rem",
              color: "#64748b",
            }}
          >
            <Users size={16} />

            <span>
              Members: {members.length}
            </span>
          </div>
        </div>
      </div>

      {/* =========================
          BOARDS + MEMBERS
      ========================= */}

      <div className="grid-2">
        {/* BOARDS */}

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
              <KanbanSquare
                size={20}
                color="#4f46e5"
              />

              Kanban Boards
            </h3>

            <button
              onClick={() =>
                setIsCreateBoardOpen(true)
              }
              className="btn btn-secondary btn-sm"
            >
              <Plus size={14} />
              New Board
            </button>
          </div>

          {boards.length === 0 ? (
            <p
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                padding: "1rem 0",
              }}
            >
              No boards created yet.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {boards.map((board) => (
                <div
                  key={board._id}
                  style={{
                    padding: "0.85rem 1rem",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "space-between",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      {board.name}
                    </h4>

                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                      }}
                    >
                      {Array.isArray(
                        board.columns
                      )
                        ? board.columns.length
                        : 0}{" "}
                      columns
                    </span>
                  </div>

                  <Link
                    to={`/boards/${board._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Open Board
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MEMBERS */}

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
              <Users
                size={20}
                color="#4f46e5"
              />

              Team Members
            </h3>

            <button
              onClick={() =>
                setIsAddMemberOpen(true)
              }
              className="btn btn-secondary btn-sm"
            >
              <UserPlus size={14} />
              Add
            </button>
          </div>

          {members.length === 0 ? (
            <p
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                padding: "1rem 0",
              }}
            >
              No members in this project.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {members.map((m) => {
                const memberUser =
                  m?.user || m;

                const memberId =
                  memberUser?._id || m?._id;

                return (
                  <div
                    key={memberId}
                    style={{
                      padding:
                        "0.75rem 1rem",
                      border:
                        "1px solid #e2e8f0",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "space-between",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontSize:
                            "0.9rem",
                          fontWeight: 600,
                          color:
                            "#0f172a",
                        }}
                      >
                        {memberUser?.name ||
                          "Member"}
                      </h4>

                      <span
                        style={{
                          fontSize:
                            "0.75rem",
                          color:
                            "#64748b",
                        }}
                      >
                        {memberUser?.email ||
                          "No email"}
                      </span>
                    </div>

                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        className="badge badge-todo"
                        style={{
                          textTransform:
                            "capitalize",
                        }}
                      >
                        {m?.role ||
                          "member"}
                      </span>

                      <button
                        className="btn-icon"
                        onClick={() =>
                          handleRemoveMember(
                            memberId
                          )
                        }
                        style={{
                          color:
                            "#ef4444",
                        }}
                      >
                        <Trash2
                          size={15}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* =========================
          WORKLOAD
      ========================= */}

      {workloadData && (
        <div className="card">
          <h3
            className="card-title"
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <BarChart2
              size={20}
              color="#4f46e5"
            />

            Member Workload Distribution
          </h3>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Active Tasks</th>
                  <th>Total Estimated Hours</th>
                  <th>Overloaded Status</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(
                  workloadData.membersWorkload
                ) &&
                  workloadData.membersWorkload.map(
                    (item, idx) => (
                      <tr key={idx}>
                        <td
                          style={{
                            fontWeight: 500,
                          }}
                        >
                          {item?.member?.name ||
                            "Member"}
                        </td>

                        <td>
                          {item?.activeTasksCount ||
                            0}
                        </td>

                        <td>
                          {item?.activeHours ||
                            0}{" "}
                          hrs
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              item?.overloaded
                                ? "badge-high"
                                : "badge-completed"
                            }`}
                          >
                            {item?.overloaded
                              ? "Overloaded"
                              : "Optimal"}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================
          ADD MEMBER MODAL
      ========================= */}

      <Modal
        isOpen={isAddMemberOpen}
        onClose={() =>
          setIsAddMemberOpen(false)
        }
        title="Add Member to Project"
      >
        <form onSubmit={handleAddMember}>
          <div className="form-group">
            <label className="form-label">
              User ID (MongoDB ID) *
            </label>

            <input
              type="text"
              className="form-input"
              placeholder="Enter MongoDB User ID"
              value={newMemberUserId}
              onChange={(e) =>
                setNewMemberUserId(
                  e.target.value
                )
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Role in Project
            </label>

            <select
              className="form-select"
              value={newMemberRole}
              onChange={(e) =>
                setNewMemberRole(
                  e.target.value
                )
              }
            >
              <option value="member">
                Member
              </option>

              <option value="manager">
                Manager
              </option>
            </select>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                setIsAddMemberOpen(false)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting
                ? "Adding..."
                : "Add Member"}
            </button>
          </div>
        </form>
      </Modal>

      {/* =========================
          CREATE BOARD MODAL
      ========================= */}

      <Modal
        isOpen={isCreateBoardOpen}
        onClose={() =>
          setIsCreateBoardOpen(false)
        }
        title="Create New Board"
      >
        <form onSubmit={handleCreateBoard}>
          <div className="form-group">
            <label className="form-label">
              Board Name *
            </label>

            <input
              type="text"
              className="form-input"
              placeholder="e.g. Sprint 1 Board"
              value={newBoardName}
              onChange={(e) =>
                setNewBoardName(
                  e.target.value
                )
              }
              required
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                setIsCreateBoardOpen(false)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting
                ? "Creating..."
                : "Create Board"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};