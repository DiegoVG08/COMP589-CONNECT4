import React from 'react';
import './Leaderboard.css';

interface LeaderboardProps {}

const Leaderboard: React.FC<LeaderboardProps> = () => {
  // Generate an array of 10 random names
  const names: string[] = Array.from({ length: 10 }, () =>
    Math.random().toString(36).substring(7)
  );

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>
      <ol className="leaderboard-list">
        {names.map((name, index) => (
          <li key={name}>
            <span className="leaderboard-number">{index + 1}</span>
            {name}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
