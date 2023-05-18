import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const Leaderboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Retrieve the top 10 scores from Firestore
    const db = getFirestore();
    const q = query(collection(db, 'users'), orderBy('wins', 'desc'), limit(10));
    getDocs(q)
      .then((querySnapshot) => {
        const users = [];
        let currentRank = 1;
        let prevWins = null;

        querySnapshot.forEach((doc) => {
          const user = { name: doc.data().username, wins: doc.data().wins };

          if (user.wins !== prevWins) {
            // Update the rank only if the wins are different
            user.rank = currentRank;
          }

          users.push(user);
          prevWins = user.wins;
          currentRank++;
        });

        // Fill in the blank ranks for tied users
        for (let i = 0; i < users.length; i++) {
          if (!users[i].rank) {
            users[i].rank = users[i - 1].rank;
          }
        }

        setData(users);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
            <tr key={index}>
              <th scope="row">{item.rank}</th>
              <td>{item.name}</td>
              <td className="text-end">{item.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
