function TaskItem({ task, toggleTask, deleteTask }) {
  return (
    <div className="task" key={task._id}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => toggleTask(task)}
      />
      <div className="task-info">
        <strong className={task.done ? "done" : ""}>{task.title}</strong>
        <small>{task.subject} · {task.priority} Priority</small>
      </div>
      <button className="delete" onClick={() => deleteTask(task._id)}>✕</button>
    </div>
  );
}

export default TaskItem;
