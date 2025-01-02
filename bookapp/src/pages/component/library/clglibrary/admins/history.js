import { useEffect, useState } from 'react';
import AdminLayout from './layout';
import styles from '@/styles/adminhistory.module.css'

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch history data from the API
    const fetchHistory = async () => {
      try {
        const response = await fetch('backendlibrary-production.up.railway.app/admin-history'); // Adjust API endpoint as per your backend
        if (!response.ok) {
          throw new Error('Failed to fetch history records.');
        }
        const data = await response.json();
        setHistoryData(data.history);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className={styles.history_container}>
      <h1 className={styles.history_title}>Admin History</h1>
      {historyData.length === 0 ? (
        <p className={styles.no_records}>No history records found.</p>
      ) : (
        <table className={styles.history_table}>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Book Name</th>
              <th>Borrowed Date</th>
              <th>Due Date</th>
              <th>Returned Date</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((record) => (
              <tr key={record._id}>
                <td>{record.user.firstName} {record.user.lastName}</td>
                <td>{record.book.title}</td>
                <td>{new Date(record.borrowedDate).toLocaleDateString()}</td>
                <td>{new Date(record.dueDate).toLocaleDateString()}</td>
                <td>{new Date(record.returnedDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

History.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
