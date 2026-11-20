function Sidebar({ page, setPage, logout }) {
  return (
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
  );
}

export default Sidebar;
