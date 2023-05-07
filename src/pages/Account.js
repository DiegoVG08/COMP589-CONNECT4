import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';

import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import './style.css';

function AccountPage() {
  const [user, setUser] = useState(null);
  const [displayUser, setDisplayUser] = useState('');
  const [email, setEmail] = useState('');
  const [totalWins, setTotalWins] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log(currentUser);
      setUser(currentUser);
      setEmail(currentUser.email);
      setDisplayUser(currentUser.username);
      console.log(currentUser.email)
      const db = getFirestore();
      const userDoc = doc(db, 'users', currentUser.uid);
      getDoc(userDoc).then(doc => {
        if (doc.exists()) {
          setTotalWins(doc.data().totalWins);
          setDisplayUser(doc.data().username);
          console.log(doc.data().username);
        } else {
          console.log('No such document!');
        }
      }).catch(error => {
        console.log('Error getting document:', error);
      });
    }
  }, []);
  
  

  const handleDisplayNameChange = (e) => {
    setDisplayUser(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    const auth = getAuth();
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayUser,
          });
      const db = getFirestore();
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDoc, { username : displayUser});
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mt-5">
    <div className="row">
     
        <div className="form" style={{ backgroundColor: "white", border: "2px solid black", alignContent: 'center', }}>
        <div className="col-md-8">
        <h3>Account Information</h3>
          <div className="form-body">
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isUpdating} />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" id="username" placeholder="Username" value={displayUser} onChange={handleDisplayNameChange} disabled={!isUpdating} />
            </div>
            <div className="form-group">
              <label htmlFor="totalWins">Total Wins</label>
              <input type="number" className="form-control" id="totalWins" value={totalWins} readOnly />
            </div>
            <div className="form-group mt-3">
              {!isUpdating && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsUpdating(true)}
                  style={{ backgroundColor: "gray", border: "2px solid black"}}
                >
                  Update Profile
                </button>
              )}
              {isUpdating && (
                <>
                  <button type="button" className="btn btn-success mx-2" onClick={handleUpdateProfile}>
                    Save Changes
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => {
                      setIsUpdating(false);
                      setDisplayUser(user.displayName);
                      setEmail(user.email);
                    }}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
  
}

export default AccountPage;
