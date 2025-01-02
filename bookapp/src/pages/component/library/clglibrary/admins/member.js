'use client';

import { useState, useEffect } from 'react';
import AdminLayout from './layout';
import styles from '@/styles/member.module.css';
import { useRouter } from 'next/router';

export default function Member() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const router = useRouter();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('http://localhost:8000/all-members');
        const data = await response.json();
        setMembers(data.members);
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter((member) => {
    const firstName = member.studentProfile?.firstName || '';
    const lastName = member.studentProfile?.lastName || '';
    const email = member.studentProfile?.email || '';
    const role = member.role || '';

    const matchesSearch =
      firstName.toLowerCase().includes(search.toLowerCase()) ||
      lastName.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      filterRole === 'All' || role.toLowerCase() === filterRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const handleAddMember = () => {
    router.push('/component/library/clglibrary/admins/addmember');
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.mainpage}>
          <div className={styles.header}>
            <div className={styles.heading}>
              <h1 className={styles.h1}>Members</h1>
              <p className={styles.p}>
                To add members and view the reports of members.
              </p>
            </div>
            <div className={styles.divider}>
              <input
                className={styles.input}
                type="text"
                placeholder="Search Member"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={handleAddMember}
                className={styles.member_button}
              >
                Add Members
              </button>
              <button className={styles.button}>Import</button>
            </div>
          </div>
          <div className={styles.filterButtons}>
              <button
                onClick={() => setFilterRole('All')}
                className={`${styles.filterButton} ${
                  filterRole === 'All' ? styles.activeButton : ''
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterRole('Staff')}
                className={`${styles.filterButton} ${
                  filterRole === 'Staff' ? styles.activeButton : ''
                }`}
              >
                Staff
              </button>
              <button
                onClick={() => setFilterRole('User')}
                className={`${styles.filterButton} ${
                  filterRole === 'User' ? styles.activeButton : ''
                }`}
              >
                Users
              </button>
            </div>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Serial No.</th>
                <th className={styles.th}>Register ID</th>
                <th className={styles.th}>Member</th>
                <th className={styles.th}>Email ID</th>
                <th className={styles.th}>Role</th>
                <th className={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, index) => (
                <tr key={index} className={styles.tr}>
                  <td className={styles.td}>{index + 1}</td>
                  <td className={styles.td}>{member.userid}</td>
                  <td className={styles.td}>
                    {member.studentProfile?.firstName}{' '}
                    {member.studentProfile?.lastName || 'No Detail'}
                  </td>
                  <td className={styles.td}>
                    {member.studentProfile?.email || 'No Detail'}
                  </td>
                  <td className={styles.td}>{member.role}</td>
                  <td className={styles.td}>
                    <button className={styles.buttonEdit}>Edit</button>
                    <button className={styles.buttonCancel}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
