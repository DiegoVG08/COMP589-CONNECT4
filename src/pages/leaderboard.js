import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Leaderboard = () => {
  // Generate an array of 10 random names and scores
  const data = Array.from({ length: 10 }, () => ({
    name: Math.random().toString(36).substring(7),
    score: Math.floor(Math.random() * 100),
  }));

  // Sort data by score in descending order
  data.sort((a, b) => b.score - a.score);

  return (
    <div className="container">
      <h1 className="text-center">Leaderboard</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Username</th>
            <th scope="col" className="text-end">Games Won</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.name}>
              <th scope="row">{index + 1}</th>
              <td>{item.name}</td>
              <td className="text-end">{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
