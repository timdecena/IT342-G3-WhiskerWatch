import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../assets/UserProfile.module.css';

const UserProfile = () => {
  const [user, setUser] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const token = localStorage.getItem('token');
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8080/api/users/getUserById/${userId}`)
        .then((response) => {
          setUser({
            id: response.data.id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            password: ''
          });
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          setMessage('Failed to load user profile.');
        });
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.id) {
      setMessage('User ID not loaded. Please refresh.');
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:8080/api/users/updateUser/${user.id}`,
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setMessage('✅ Profile updated successfully!');
      setUser({ ...response.data, password: '' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('❌ Failed to update profile.');
    }
  };
  

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>Update Your Profile</h2>
      {message && <p className={styles.message}>{message}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          First Name:
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label className={styles.label}>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label className={styles.label}>
          Email:
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        <label className={styles.label}>
          New Password:
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className={styles.input}
            placeholder="Leave blank to keep current"
          />
        </label>

        <button type="submit" className={styles.updateBtn}>Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfile;
