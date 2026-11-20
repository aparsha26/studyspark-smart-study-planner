import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatCard from "./StatCard";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Web Development");
  const [page, setPage] = useState("Dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [subjects, setSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem("studySubjects");
      return saved ? JSON.parse(saved) : [
        "Web Development",
        "DSA",
        "Cloud Computing",
        "Database Management"
      ];
    } catch {
      return ["Web Development", "DSA", "Cloud Computing", "Database Management"];
    }
  });

  const [newSubject, setNewSubject] = useState("");
  
  const user = (() => {
    try {
      const saved = localStorage.getItem("studyUser");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  })();

  async function fetchTasks() {
    try {
      setError("");
      const data = await apiRequest("/tasks");
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    localStorage.setItem("studySubjects", JSON.stringify(subjects));
  }, [subjects]);

  function addSubject(e) {
    e.preventDefault();
    const name = newSubject.trim();

    if (!name) return alert("Please enter a subject name.");

    if (subjects.some(s => s.toLowerCase() === name.toLowerCase())) {
      return alert("Subject already exists!");
    }

    setSubjects([...subjects, name]);
    setNewSubject("");
  }

  async function addTask(e) {
    e.preventDefault();

    if (!title.trim()) return alert("Please enter a task name.");

    try {
      await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          subject,
          priority: "Medium",
          done: false
        })
      });

      setTitle("");
      await fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  }

  async function toggleTask(task) {
    try {
      await apiRequest(`/tasks/${task._id}`, {
        method: "PUT",
        body: JSON.stringify({ done: !task.done })
      });
      await fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  }

  async function deleteTask(id) {
    try {
      await apiRequest(`/tasks/${id}`, { method: "DELETE" });
      await fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  }

  function logout() {
    localStorage.removeItem("studyToken");
    localStorage.removeItem("studyUser");
    navigate("/login");
  }

  const completed = tasks.filter(t => t.done).length;

  function renderTasks(filteredTasks) {
    if (loading) return <p>Loading tasks...</p>;
    if (error) return <p role="alert">{error}</p>;
    if (!filteredTasks.length) return <p>No tasks found. Add your first study task!</p>;

    return filteredTasks.map(task => (
      <TaskItem
        key={task._id}
        task={task}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
      />
    ));
  }

  return (
    <div className="layout">
      <Sidebar page={page} setPage={setPage} logout={logout} />

      <main className="main">
        <Header page={page} userName={user.name} />

        {page === "Dashboard" && (
          <>
            <section className="welcome">
              <h2>Your goals, your progress!</h2>
              <p>Plan smarter, study better and achieve more with StudySpark.</p>
            </section>

            <section className="stats">
              <StatCard icon="📚" count={subjects.length} label="Total Subjects" />
              <StatCard icon="📝" count={tasks.length} label="Total Tasks" />
              <StatCard icon="✅" count={completed} label="Completed" />
              <StatCard icon="⏳" count={tasks.length - completed} label="Pending" />
            </section>

            <section className="task-section">
              <h2>My Study Tasks</h2>
              <TaskForm
                title={title}
                setTitle={setTitle}
                subject={subject}
                setSubject={setSubject}
                subjects={subjects}
                addTask={addTask}
              />
              {renderTasks(tasks)}
            </section>
          </>
        )}

        {page === "My Subjects" && (
          <section className="task-section">
            <h2>My Study Subjects 📚</h2>
            <form onSubmit={addSubject} className="task-form">
              <input
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                placeholder="Enter a new subject name..."
              />
              <button type="submit">+ Add Subject</button>
            </form>

            <section className="stats">
              {subjects.map(s => (
                <div className="stat" key={s}>
                  <span>📖</span>
                  <h3>{s}</h3>
                  <p>{tasks.filter(t => t.subject === s).length} Tasks</p>
                  <button onClick={() => {
                    setSubject(s);
                    setPage("My Tasks");
                  }}>
                    View Tasks
                  </button>
                </div>
              ))}
            </section>
          </section>
        )}

        {page === "My Tasks" && (
          <section className="task-section">
            <h2>My Tasks 📝</h2>
            <TaskForm
              title={title}
              setTitle={setTitle}
              subject={subject}
              setSubject={setSubject}
              subjects={subjects}
              addTask={addTask}
            />
            <h3>Showing tasks for: {subject}</h3>
            {renderTasks(tasks.filter(t => t.subject === subject))}
          </section>
        )}

        <footer>Made with 💜 StudySpark – Your Smart Study Planner</footer>
      </main>
    </div>
  );
}

export default Dashboard;
