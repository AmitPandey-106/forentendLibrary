import React from 'react'
import AdminLayout from '../admins/layout';
import Userlayout from '../../../../../u_layout'
import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/pages/component/context/authcontext';

export default function Novel() {
  const { authUser } = useContext(AuthContext);
  const [selectedOption, setSelectedOption] = useState('');
  const router = useRouter();

  const Layout = authUser.role === 'user' ? Userlayout : AdminLayout

    const handleComponent = (value) => {
      setSelectedOption(value); // Update the selected option in state
      router.push(`/component/library/clglibrary/users/${value}`); // Navigate to the respective page
    };
    
    useEffect(() => {
      const currentPath = router.pathname.split('/').pop(); // Get the last part of the path
      setSelectedOption(currentPath);
    }, [router.pathname]);
    
  return (
    <Layout>
    <div>
      <div style={{ margin: '10px 0' , minHeight:'100vh'}}>
        <select
          style={{ margin: "0px 10px", padding:'5px 10px', fontSize:'20px' }}
          value={selectedOption}
          onChange={(e) => handleComponent(e.target.value)}
        >
          <option value="novel">Novel</option>
          <option value="story">Story</option>
          <option value="others">All</option>
        </select>
        <p style={{display:'flex', alignItems:'center', justifyContent:'center'}}>Novel Part is Under Construction</p>
      </div>
    </div>
    </Layout>
  )
}

