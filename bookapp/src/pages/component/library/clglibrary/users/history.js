import React, { useContext, useState, useEffect } from 'react';
import Userlayout from '../../../../../u_layout';
import { AuthContext } from '@/pages/component/context/authcontext';
import Image from 'next/image';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    if (!authUser || !authUser.id) {
      // Wait until authUser and authUser.id are available
      console.warn('Auth user or ID not available yet.');
      return;
    }

    const fetchHistory = async () => {
      try {
        console.log(`Fetching history for user ID: ${authUser.id}`);
        const response = await fetch(`backendlibrary-production.up.railway.app/users/${authUser.id}/history`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch history: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched history:', data);
        setHistory(data.history);
      } catch (err) {
        console.error('Error fetching history:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (authUser?.id) {
      fetchHistory();
    }
  }, [authUser]);

  if (!authUser || !authUser.id) return <p>Loading user information...</p>;
  if (loading) return <p>Loading history...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Book Borrowing History</h2>
      {history.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              <Image
                    src={entry.book.bookimage}
                    alt={entry.book.title}
                    style={{ width: '100px', height: '150px' }}
                  />
              <strong>Title:</strong> {entry.title || 'Unknown'} <br />
              <strong>Borrow Date:</strong> {entry.borrowDate ? new Date(entry.borrowDate).toLocaleDateString() : 'N/A'} <br />
              <strong>Due Date:</strong> {entry.dueDate ? new Date(entry.dueDate).toLocaleDateString() : 'N/A'} <br />
              <strong>Return Date:</strong>{' '}
              {entry.returnDate ? new Date(entry.returnDate).toLocaleDateString() : 'Not Returned'} <br />
              {entry.removedByAdmin && <strong>Removed by Admin</strong>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

History.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};