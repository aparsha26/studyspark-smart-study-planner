function StatCard({ icon, count, label }) {
  return (
    <div className="stat">
      <span>{icon}</span>
      <h2>{count}</h2>
      <p>{label}</p>
    </div>
  );
}

export default StatCard;
