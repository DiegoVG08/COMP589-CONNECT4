import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const Leaderboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Retrieve the top 10 scores from Firestore
    const db = getFirestore();
    const q = query(collection(db, 'users'), limit(10));
    //, orderBy('score', 'desc')
    getDocs(q).then((querySnapshot) => {
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ name: doc.data().username });
        //, score: doc.data().score
      });
      setData(results);
    }).catch((error) => {
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