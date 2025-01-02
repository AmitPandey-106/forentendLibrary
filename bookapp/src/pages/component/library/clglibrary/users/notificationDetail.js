import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Userlayout from '../../../../../u_layout';
import Image from 'next/image';

NotificationDetails.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};

export default function NotificationDetails() {
  const router = useRouter();
  const { id } = router.query; // Get the notification ID from the query
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchNotificationDetails = async () => {
      if (!id) return;

      try {
        const response = await fetch(`backendlibrary-production.up.railway.app/notifications/details/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch notification details: ${response.statusText}`);
        }

        const data = await response.json();
        setNotification(data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching notification details:', error);
      }
    };

    fetchNotificationDetails();
  }, [id]);

  if (!notification) {
    return <p>Loading notification details...</p>;
  }

  return (
    <div>
      <h2>Notification Details</h2>
      <p><strong>Title:</strong> {notification.title}</p>
      <Image src={notification.book.bookimage} alt={notification.book.title} className="book-image" style={{width:'100px'}}/>
      <p><strong>Message:</strong> {notification.message}</p>
      <p><strong>Book Title:</strong> {notification.book?.title || 'N/A'}</p>
      <p><strong>Author:</strong> {notification.book?.author || 'N/A'}</p>
      <p><strong>User:</strong> {notification.user?.firstName|| 'N/A'} {notification.user?.lastName|| 'N/A'}</p>
      <p><strong>Return Date:</strong> {new Date(notification.dueDate).toLocaleString()}</p>
      <p><strong>Penalty:</strong> {notification.penalty || 'None'}</p>
    </div>
  );
}
