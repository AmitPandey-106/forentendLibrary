import { useState, useEffect, useContext } from 'react';
import Userlayout from '../../../../../u_layout';
import { AuthContext } from '@/pages/component/context/authcontext';
import { useRouter } from 'next/router';

Notification.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const { profileId } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!profileId) {
        console.log('Profile ID is not available yet');
        return;
      }
      try {
        const response = await fetch(`https://backendlibrary-2.onrender.com/notifications/${profileId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch notifications: ${response.statusText}`);
        }

        const data = await response.json();
        setNotifications(data.notifications);
        console.log(data.notifications)
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [profileId]);

  const handleNotificationClick = (notificationId) => {
    // Navigate to the detailed notification page
    router.push(`/component/library/clglibrary/users/notificationDetail?id=${notificationId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Date not available'; // Fallback text if the date is invalid or missing
    }
  
    try {
      const options = { hour: '2-digit', minute: '2-digit' };
      return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date'; // Fallback in case of formatting errors
    }
  };
  

  return (
    <div>
      <h2>Notification</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <div key={notif._id} onClick={() => handleNotificationClick(notif._id)} style={{ cursor: 'pointer' }}>
              <li><strong>{notif.title}</strong></li>
              <li>{notif.message}</li>
              <li><small>{formatDate(notif.timestamp)}</small></li>
              <hr />
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
