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
    <li>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Due-Date: {formattedDate}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.status}</p>
      <p>Created By: {task.createdBy?.username || "Unknown"}</p>
      <p>Assigned To: {task.assignedTo?.username || "Unassigned"}</p>
      {task.createdBy === currentUserId && (
        <button onClick={handleEdit}>Edit</button>
      )}
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
};

export default TaskItem;
