//Maps through tasks and displays each TaskItem.

import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onEdit, onDelete, currentUserId }) => {
  return (
    <ul>
      {tasks.map((task) => {
        return (
          <TaskItem
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            currentUserId={currentUserId}
          />
        );
      })}
    </ul>
  );
};

export default TaskList;
