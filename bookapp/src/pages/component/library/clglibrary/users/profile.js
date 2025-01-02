import Userlayout from '../../../../../u_layout'
import Image from 'next/image'
import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '@/pages/component/context/authcontext'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false); // For logout confirmation
  const router = useRouter();
  const { authUser, signOut } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated');
          router.push('/signin'); // Redirect if not authenticated
          return;
        }

        const res = await fetch('http://localhost:8000/get-user-profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.status === 200) {
          setProfileData(data.profile);
        } else {
          setError(data.msg || 'Error fetching profile data');
        }
      } catch (err) {
        setError('An error occurred while fetching profile data');
      }
    };

    fetchProfileData();
  }, [router]);

  const handleLogout = () => {
    signOut(); // Call signOut from AuthContext
  };

  return (
    <div>
      <h1>Profile</h1>
      <div className='edit'>
        <Link href={`/component/library/clglibrary/users/profileform`}>Edit</Link>
      </div>
      <div className='profile'>
        <Image src="" alt="oops" />
        {profileData ? (
          <div>
            <h1>Name: {profileData.firstName} {profileData.lastName}</h1>
          </div>
        ) : (
          <p></p>
        )}
      </div>
      <hr />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '3px 0', border: '1px solid white', display: 'inline-block', width: '100px', boxShadow: '1px 1px 1px 1px gray' }}>
          <Link href={'/component/library/clglibrary/users/userinfo'}>User Info</Link>
        </h3>
        <h3 style={{ margin: '3px 0', border: '1px solid white', display: 'inline-block', width: '100px', boxShadow: '1px 1px 1px 1px gray' }}>
          <Link href={'/component/library/clglibrary/users/changepassword'}>Change Password</Link>
        </h3>
        <h3 style={{ margin: '3px 0', border: '1px solid white', display: 'inline-block', width: '100px', boxShadow: '1px 1px 1px 1px gray' }}>
          <Link href={'/component/library/clglibrary/users/borrowedbook'}>Borrowed Book</Link>
        </h3>
        <h3 style={{ margin: '3px 0', border: '1px solid white', display: 'inline-block', width: '100px', boxShadow: '1px 1px 1px 1px gray' }}>
          <Link href={'/component/library/clglibrary/users/notification'}>Notification</Link>
        </h3>
        <h3 style={{ margin: '3px 0', border: '1px solid white', display: 'inline-block', width: '100px', boxShadow: '1px 1px 1px 1px gray' }}>
          <Link href={'/component/library/clglibrary/users/history'}>History</Link>
        </h3>
        <h3
          style={{ margin: '3px 0', border: '1px solid white', display: 'inline-block', width: '100px', boxShadow: '1px 1px 1px 1px gray', cursor: 'pointer' }}
          onClick={() => setShowPopup(true)} // Show popup on click
        >
          Logout
        </h3>
      </div>

      {/* Logout Confirmation Popup */}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          <h3>Are you sure you want to logout?</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'red',
                color: 'white',
                padding: '5px 20px',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '3px',
              }}
            >
              Yes
            </button>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                backgroundColor: 'gray',
                color: 'white',
                padding: '5px 20px',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '3px',
              }}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

Profile.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>
};
