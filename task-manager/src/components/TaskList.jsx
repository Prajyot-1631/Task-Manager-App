//Maps through tasks and displays each TaskItem.

import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onEdit, onDelete }) => {
  return (
    <ul>
      {tasks.map((task) => {
        return (
          <TaskItem
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </ul>
  );
};

export default TaskList;
