import { useState, useEffect, useContext } from 'react';
import styles from '@/styles/StudentProfileForm.module.css';
import { useRouter } from 'next/router';
import { AuthContext } from '@/pages/component/context/authcontext';

export default function ProfileForm({ initialError }) {
  const [error, setError] = useState(initialError || '');
  const [success, setSuccess] = useState('');
  const {authUser} = useContext(AuthContext)
  const [formData, setFormData] = useState({
    userId: authUser?.id || '', 
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    gender: '',
    email: '',
    phoneNumber: '',
    studentID: '',
    department: '',
    yearLevel: '',
    libraryCardNumber: '',
  });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Make sure the token is stored in localStorage or another secure place
        const res = await fetch('backendlibrary-production.up.railway.app/get-user-profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Attach the token in the Authorization header
          }
        });

        if (res.status === 401) {
          setError("Unauthorized. Please log in again.");
          return;
        }

        const data = await res.json();
        if (res.status === 200) {
          setFormData(data.profile); // Pre-fill the form with user data
        } else {
          setError(data.message || 'Failed to load profile or Not filled data fill form.');
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError('An error occurred. Please try again later.');
      }
    };

    fetchData();
  }, [authUser?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (authUser?.id) {
      setFormData((prev) => ({ ...prev, userId: authUser.id }));
    }
  }, [authUser]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message
    setSuccess(''); // Reset success message

    try {
      const res = await fetch('backendlibrary-production.up.railway.app/user-profile-edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.status === 200) {
        setSuccess(data.message || 'Profile updated successfully!');
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.h2}>Personal Information</h2>
      {success && <p className={styles.successMessage}>{success}</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      <input className={styles.input} type="text" name="firstName" placeholder="First Name" onChange={handleChange} value={formData.firstName} />
      <input className={styles.input} type="text" name="middleName" placeholder="Middle Name" onChange={handleChange} value={formData.middleName} />
      <input className={styles.input} type="text" name="lastName" placeholder="Last Name" onChange={handleChange} value={formData.lastName} />
      <input className={styles.input} type="date" name="dob" placeholder="Date of Birth" onChange={handleChange} value={formData.dob} />
      <select className={styles.input} name="gender" onChange={handleChange} value={formData.gender}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="nonbinary">Non-binary</option>
      </select>

      <input className={styles.input} type="email" name="email" placeholder="Email Address" onChange={handleChange} value={formData.email} />
      <input className={styles.input} type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} value={formData.phoneNumber} />
      <input className={styles.input} type="text" name="studentID" placeholder="Student ID" onChange={handleChange} value={formData.studentID} />
      <input className={styles.input} type="text" name="department" placeholder="Department" onChange={handleChange} value={formData.department} />
      <input className={styles.input} type="text" name="yearLevel" placeholder="Year Level" onChange={handleChange} value={formData.yearLevel} />
      <input className={styles.input} type="text" name="libraryCardNumber" placeholder="Library Card Number" onChange={handleChange} value={formData.libraryCardNumber} />

      <button className={styles.button} type="submit">Submit Profile</button>
    </form>
  );
}
