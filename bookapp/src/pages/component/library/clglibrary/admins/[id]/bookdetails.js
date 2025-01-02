import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/pages/component/context/authcontext';
import AdminLayout from '../layout';
import UserLayout from '../../../../../../u_layout';
import Image from 'next/image';

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="modal-actions">
        <button onClick={onCancel} className="cancel-button">Cancel</button>
        <button onClick={onConfirm} className="confirm-button">Confirm</button>
      </div>
    </div>
    <style jsx>{`
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .modal-actions button {
        margin: 10px;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .cancel-button {
        background: #f44336;
        color: white;
      }
      .confirm-button {
        background: #4caf50;
        color: white;
      }
    `}</style>
  </div>
);

export default function BookDetails() {
  const { authUser, profileId } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  const [bookdetails, setBookdetails] = useState(null);
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [recommendations, setRecommendations] = useState([])

  const Layout = authUser.role === 'user' ? UserLayout : AdminLayout;

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleCollect = async () => {
    try {
      // Sending a POST request to borrow the book
      const response = await fetch(`http://localhost:8000/borrow/${profileId}/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Adding 7 days for the due date
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsBorrowed(true);

        // Update book quantity in the frontend state
        setBookdetails((prev) => ({
          ...prev,
          quantity: prev.quantity > 0 ? prev.quantity - 1 : 0,
        }));

        // Display a success message
        alert(
          `Successfully borrowed "${bookdetails.title}". Due date: ${new Date(
            data.dueDate
          ).toLocaleDateString()}`
        );
      } else {
        // Handle errors returned by the API
        const errorData = await response.json();
        if (errorData.message) {
          alert(`Error: ${errorData.message}`);
        } else {
          alert("Failed to borrow the book. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
      alert("An unexpected error occurred while trying to borrow the book.");
    }
  };


  const handleWaitlist = async () => {
    try {
      const response = await fetch('http://localhost:8000/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profileId, bookId: bookdetails._id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsWaitlisted(true);
        alert(data.message);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      alert('Failed to join the waitlist. Please try again.');
    }
  };

  const confirmAction = () => {
    if (modalType === 'borrow') handleCollect();
    if (modalType === 'waitlist') handleWaitlist();
    closeModal();
  };

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchBookDetails = async () => {
      try {
        const res = await fetch(`http://localhost:8000/book/${id}`);
        const data = await res.json();

        if (res.status === 200) {
          setBookdetails(data.book);
          setRecommendations(data.recommendations)
        } else {
          console.error(data.message || "Failed to fetch book details");
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [router.isReady, id]);

  return (
    <Layout>
      <div className="book-details-container">
        {authUser.role === 'user' ? (
          <div className="button-group">
            <button
              className="collect-button"
              onClick={() => openModal('borrow')}
              disabled={isBorrowed || bookdetails?.quantity === 0}
            >
              {isBorrowed ? "Go collect" : "Borrow"}
            </button>

            <button
              className="waitlist-button"
              onClick={() => openModal('waitlist')}
              disabled={isWaitlisted || bookdetails?.quantity > 0}
            >
              {isWaitlisted ? "Waitlisted" : "Join Waitlist"}
            </button>
          </div>
        ) : (
          <div className="button-group">
            <button className="edit-button" onClick={() => router.push(`/component/library/clglibrary/admins/${id}/editbook`)}>Edit</button>
            <button className="delete-button" onClick={() => alert("Delete button clicked")}>Delete</button>
          </div>
        )}
        {bookdetails ? (
          <>
            <div className='container'>
              <h1 className="book-title">{bookdetails.TITLE}</h1>
              <div className="book-details">
                <Image src={bookdetails.PHOTO} alt={bookdetails.title} className="book-image" style={{width:"250px", height:"400px"}} />
                <div className="book-info">
                  <p><strong>Title:</strong> {bookdetails.title}</p>
                  <p><strong>Author:</strong> {bookdetails.AUTH_ID1}</p>
                  <p><strong>Quantity Available:</strong> {bookdetails.quantity}</p>
                </div>
              </div>
              {recommendations.length > 0 && (
                <div className="recommendations">
                  <h2>Recommended Books</h2>
                  <div className="recommendation-list">
                    {recommendations.map((recBook) => (
                      <div
                        key={recBook._id}
                        className="recommendation-item"
                        onClick={() => router.push(`/component/library/book/${recBook._id}`)}
                      >
                        <Image src={recBook.bookimage} alt={recBook.title} className="recommendation-image" />
                        <p className="recommendation-title">{recBook.title}</p>
                      </div>
                    ))}
                  </div>
                  <style jsx>{`
      .recommendations {
        margin-top: 20px;
      }
      .recommendation-list {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
      }
      .recommendation-item {
        cursor: pointer;
        text-align: center;
      }
      .recommendation-image {
        width: 100px;
        height: 150px;
        object-fit: cover;
        border-radius: 5px;
      }
      .recommendation-title {
        margin-top: 10px;
        font-size: 14px;
        font-weight: bold;
      }
    `}</style>
                </div>
              )}

            </div>
          </>
        ) : (
          <p>Loading book details...</p>
        )}
      </div>

      {showModal && (
        <ConfirmationModal
          title={modalType === 'borrow' ? 'Confirm Borrowing' : 'Confirm Waitlisting'}
          message={
            modalType === 'borrow'
              ? 'Are you sure you want to borrow this book?'
              : 'Are you sure you want to join the waitlist for this book?'
          }
          onConfirm={confirmAction}
          onCancel={closeModal}
        />
      )}
    </Layout>
  );
} 
