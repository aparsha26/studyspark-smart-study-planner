function Header({ page, userName }) {
  const initial = userName && userName.trim() ? userName.trim()[0].toUpperCase() : "A";

  return (
    <header>
      <div>
        <h1>{page}</h1>
        <p>Welcome back, {userName || "Student"}! Let's be productive ✨</p>
      </div>
      <span className="avatar">{initial}</span>
    </header>
  );
}

export default Header;
