const TaskItem = ({ task, onEdit, onDelete }) => {
  const handleEdit = () => onEdit(task);
  const handleDelete = () => onDelete(task._id);
  return (
    <li>
      <strong>
        {task.title} - {task.status} - {task.priority}
      </strong>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
};

export default TaskItem;
