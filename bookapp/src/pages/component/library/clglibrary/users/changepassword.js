import { useState, useEffect } from 'react';
import Userlayout from '../../../../../u_layout'
import { useRouter } from 'next/router';
import styles from '@/styles/changepassword.module.css';
import NextNProgress from 'nextjs-progressbar';

ChangePassword.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    // Check for token on component mount
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to signin page if no token is found
      router.push('../../../../auth/librarysignin');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
        setMessage('Passwords do not match');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('User not authenticated');
            router.push('../../../../auth/librarysignin'); // Redirect to signin
            return;
        }

        const response = await fetch(`${backendUrl}/change-user/password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const data = await response.json();

        if (response.ok) {
            setMessage(data.msg); // Show success message
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setMessage(data.error || 'Something went wrong');
        }
    } catch (error) {
        setMessage('Server error. Please try again later.');
    }
};


  return (
    <div className='full_container' style={{minHeight:'100vh', display:'flex', justifyContent:'center', alignContent:'center', alignItems:'center'}}>
    <div className={styles.fg_pass}>
      <NextNProgress
        color="#32CD32"       
        startPosition={0.3} 
        stopDelayMs={200}   
        height={3}          
        showOnShallow={true} 
      />
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        {message && <p>{message}</p>}
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
    </div>
  );
}
