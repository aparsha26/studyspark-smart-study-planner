import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api";

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
          <Link to={signup ? "/login" : "/signup"}>
            {signup ? "Login" : "Create Account"}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default AuthPage;
