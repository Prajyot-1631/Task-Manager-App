//Maps through tasks and displays each TaskItem.

import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onEdit, onDelete, currentUserId }) => {
  return (
    <div className="row g-4">
      {tasks.map((task) => (
        <div key={task._id} className="col-md-6 col-lg-4">
          <TaskItem
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            currentUserId={currentUserId}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
