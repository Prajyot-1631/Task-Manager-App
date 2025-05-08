//Renders individual task with edit/delete.

const TaskItem = ({ task, onEdit, onDelete, currentUserId }) => {
  const handleEdit = () => onEdit(task);
  const handleDelete = () => onDelete(task._id);

  const formattedDate = new Date(task.dueDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Title: {task.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          {task.status.toUpperCase()}
        </h6>
        <p className="card-text">{task.description}</p>
        <p className="mb-1">
          <strong>Due:</strong> {formattedDate}
        </p>
        <p className="mb-1">
          <strong>Priority:</strong> {task.priority}
        </p>
        <p className="mb-1">
          <strong>Created By:</strong> {task.createdBy?.username || "Unknown"}
        </p>
        <p className="mb-3">
          <strong>Assigned To:</strong>{" "}
          {task.assignedTo?.username || "Unassigned"}
        </p>

        <div className="d-flex gap-2">
          {task.createdBy === currentUserId && (
            <button className="btn btn-warning btn-sm" onClick={handleEdit}>
              Edit
            </button>
          )}
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
