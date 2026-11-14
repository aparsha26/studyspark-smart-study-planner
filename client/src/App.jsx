
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";
import "./App.css";

const API = "http://localhost:5000/api";

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("studyToken");

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Protected route
function ProtectedRoute({ children }) {
  return localStorage.getItem("studyToken")
    ? children
    : <Navigate to="/login" replace />;
}

// Login and Signup
function AuthPage({ signup = false }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill all required fields.");
      return;
    }

    if (signup && (!name.trim() || password.length < 6)) {
      setError("Enter your name and a password of at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest(
        signup ? "/auth/signup" : "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ name, email, password })
        }
      );

      localStorage.setItem("studyToken", data.token);
      localStorage.setItem("studyUser", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>⚡ StudySpark</h1>
        <h2>{signup ? "Create Account" : "Welcome Back!"}</h2>
        <p>Your smart study planner</p>

        {signup && (
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your Name"
            required
          />
        )}

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email Address"
          required
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password (minimum 6 characters)"
          minLength={6}
          required
        />

        {error && <p role="alert" className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : signup ? "Sign Up" : "Login"}
        </button>

        <p>
          {signup ? "Already have an account?" : "New to StudySpark?"}
          {" "}
          <a href={signup ? "/login" : "/signup"}>
            {signup ? "Login" : "Create Account"}
          </a>
        </p>
      </form>
    </div>
  );
}

// Dashboard
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
      return JSON.parse(localStorage.getItem("studySubjects")) || [
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
  const user = JSON.parse(localStorage.getItem("studyUser") || "{}");

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
    ));
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>⚡ StudySpark</h2>
        {["Dashboard", "My Subjects", "My Tasks"].map(item => (
          <p
            key={item}
            className={page === item ? "active" : ""}
            onClick={() => setPage(item)}
          >
            {item}
          </p>
        ))}
        <button onClick={logout}>Logout</button>
      </aside>

      <main className="main">
        <header>
          <div>
            <h1>{page}</h1>
            <p>Welcome back, {user.name || "Student"}! Let's be productive ✨</p>
          </div>
          <span className="avatar">A</span>
        </header>

        {page === "Dashboard" && (
          <>
            <section className="welcome">
              <h2>Your goals, your progress!</h2>
              <p>Plan smarter, study better and achieve more with StudySpark.</p>
            </section>

            <section className="stats">
              {[
                ["📚", subjects.length, "Total Subjects"],
                ["📝", tasks.length, "Total Tasks"],
                ["✅", completed, "Completed"],
                ["⏳", tasks.length - completed, "Pending"]
              ].map(([icon, count, label]) => (
                <div className="stat" key={label}>
                  <span>{icon}</span>
                  <h2>{count}</h2>
                  <p>{label}</p>
                </div>
              ))}
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

// Reusable component with Props
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          localStorage.getItem("studyToken")
            ? <Navigate to="/" replace />
            : <AuthPage />
        } />
        <Route path="/signup" element={
          localStorage.getItem("studyToken")
            ? <Navigate to="/" replace />
            : <AuthPage signup />
        } />
        <Route path="/" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
