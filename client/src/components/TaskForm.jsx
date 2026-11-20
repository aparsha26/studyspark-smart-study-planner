function TaskForm({ title, setTitle, subject, setSubject, subjects, addTask }) {
  return (
    <form onSubmit={addTask} className="task-form">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Enter a new study task..."
        required
      />
      <select value={subject} onChange={e => setSubject(e.target.value)}>
        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <button type="submit">Add Task +</button>
    </form>
  );
}

export default TaskForm;
