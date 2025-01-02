import AdminLayout from './layout';
import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import { AuthContext } from '@/pages/component/context/authcontext';

export default function AdminUpdateBook(){
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // Now authUser is available, make the fetch request
      const fetchBorrowedBooks = async () => {
        try {
          const res = await fetch(`http://localhost:8000/all-borrow-books`, { 
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          const data = await res.json();
          // console.log("API Response:", data);

          if (res.status === 200) {
            setBorrowedBooks(data.borrowedBooks || []);  // Ensure it always sets an array, even if empty
          } else {
            console.error('Failed to fetch borrowed books');
          }
        } catch (error) {
          console.error('Error fetching borrowed books:', error);
        } finally {
          setLoading(false); // Set loading to false once the data is fetched
        }
      };

      fetchBorrowedBooks();
  }, []);  // Dependency on authUser to ensure it only runs when available

    const handleRemoveBook = async (bookId) => {
        if (!window.confirm("Are you sure you want to remove this book?")) return;
      
        try {
          const response = await fetch(`http://localhost:8000/remove-borrow/${bookId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (!response.ok) {
            throw new Error("Failed to remove book.");
          }
      
          setBorrowedBooks((prevBooks) =>
            prevBooks.filter((book) => book._id !== bookId)
          );
      
          alert("Book removed successfully.");
        } catch (error) {
          alert(error.message);
        }
      };

  if (loading) {
    return <div>Loading borrowed books...</div>;
  }

  return (
    <div>
      <h2>Borrowed Books</h2>

      {borrowedBooks.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Student</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>studentID</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Book Image</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Borrowed On</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Due On</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Remove</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map((borrowedBook) => (
              <tr key={borrowedBook._id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{borrowedBook.user.firstName} {borrowedBook.user.lastName}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{borrowedBook.user.studentID}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <Image
                    src={borrowedBook.book.bookimage}
                    alt={borrowedBook.book.title}
                    style={{ width: '100px', height: '150px' }}
                  />
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {new Date(borrowedBook.borrowDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {new Date(borrowedBook.dueDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <button style={{ padding: '8px', border: '1px solid #ddd', backgroundColor:'red' }} onClick={() => handleRemoveBook(borrowedBook._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have no borrowed books.</p>
      )}
    </div>
  );
}

AdminUpdateBook.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
  };