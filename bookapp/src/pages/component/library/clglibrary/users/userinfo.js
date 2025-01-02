import Userlayout from '../../../../../u_layout'
import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '@/pages/component/context/authcontext'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Userinfo() {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated');
          router.push('/signin'); // Redirect if not authenticated
          return;
        }

        const res = await fetch('backendlibrary-production.up.railway.app/get-user-profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.status === 200) {
          const Id = data.profile._id;
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

  return (
    <div>
      <div className='profile'>
        {profileData ? (
          <div>
          <h1>Name: {profileData.firstName} {profileData.lastName}</h1>
          <h1>Middle Name: {profileData.middleName}</h1>
          <h1>DOB: {new Date(profileData.dob).toISOString().split('T')[0]}</h1>
          <h1>Gender: {profileData.gender}</h1>
          <h1>email: {profileData.email}</h1>
          <h1>Phone: {profileData.phoneNumber}</h1>
          <h1>StudentId: {profileData.studentID}</h1>
          <h1>Department: {profileData.department}</h1>
          <h1>Year: {profileData.yearLevel}</h1>
          <h1>libraryCard: {profileData.libraryCardNumber}</h1>
        </div>
        ):(
          <p>Loading profile...</p>
        )}
      </div>
      <hr></hr>
    </div>
  )
}

Userinfo.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>
}
