import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile, updatePassword} from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import './style.css';

function AccountPage() {
  const [user, setUser] = useState(null);
  const [displayUser, setDisplayUser] = useState('');
  const [email, setEmail] = useState('');
  const [totalWins, setTotalWins] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile(user, {
        displayName: displayUser,
      });
  
      if (newPassword !== '' && newPassword === confirmPassword) {
        await updatePassword(user, newPassword);
        setNewPassword('');
        setConfirmPassword('');
      }
  
      const db = getFirestore();
      const userDoc = doc(db, 'users', user.uid);
      await updateDoc(userDoc, { username: displayUser });
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
        <div className="form" style={{ backgroundColor: 'white', border: '2px solid black', alignContent: 'center' }}>
          <div className="col-md-8">
            <h3>Account Information</h3>
            <form onSubmit={handleUpdateProfile}>
              <div className="form-body">
                <div className="form-group mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input type="email" className="form-control" id="email" placeholder="Email" value={email} onChange={handleEmailChange} readOnly />
                </div>
                <div
className="form-group mb-3">
<label htmlFor="username" className="form-label">
Username
</label>
<input type="text" className="form-control" id="username" placeholder="Username" value={displayUser} onChange={handleDisplayNameChange} disabled={!isUpdating} />
</div>
<div className="form-group mb-3">
<label htmlFor="newPassword" className="form-label">
New Password
</label>
<input type="password" className="form-control" id="newPassword" placeholder="New Password" value={newPassword} onChange={handleNewPasswordChange} disabled={!isUpdating} />
</div>
<div className="form-group mb-3">
<label htmlFor="confirmPassword" className="form-label">
Confirm Password
</label>
<input type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={handleConfirmPasswordChange} disabled={!isUpdating} />
</div>
{passwordError && <p>{passwordError}</p>}
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
style={{ backgroundColor: 'gray', border: '2px solid black' }}
>
Update Profile
</button>
)}
{isUpdating && (
<>
<button type="submit" className="btn btn-success mx-2">
Save Changes
</button>
<button
type="button"
className="btn btn-danger"
onClick={() => {
setIsUpdating(false);
setDisplayUser(user.displayName);
setEmail(user.email);
}}
>
Cancel
</button>
</>
)}
</div>
</div>
</form>
</div>
</div>
</div>
</div>
);
}

export default AccountPage;
