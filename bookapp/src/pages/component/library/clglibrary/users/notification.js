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
        const response = await fetch(`http://localhost:8000/notifications/${profileId}`, {
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

  return (
    <div>
      <h2>Notification</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <div key={notif._id} onClick={() => handleNotificationClick(notif._id)} style={{ cursor: 'pointer' }}>
              <li>{notif.title}</li>
              <li>{notif.message}</li>
              <hr />
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
