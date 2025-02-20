import React, { useEffect, useState, useContext } from 'react';
import Userlayout from '../../../../../u_layout'
import { AuthContext } from '@/pages/component/context/authcontext';
import styles from '@/styles/borrowedbooks.module.css';
import Image from 'next/image';
import NextNProgress from 'nextjs-progressbar';
import SearchAnimation from './SearchAnimation';

Borrowedbook.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};

export default function Borrowedbook() {
  const { authUser, profileId } = useContext(AuthContext); // Get the authenticated user
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL  
  const defaultimage = 'https://th.bing.com/th/id/OIP.3J5xifaktO5AjxKJFHH7oAAAAA?rs=1&pid=ImgDetMain';
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (authUser && authUser.id) {
      // Now authUser is available, make the fetch request
      const fetchBorrowedBooks = async () => {
        try {
          const res = await fetch(`${backendUrl}/user/${authUser.id}/borrowed-books`, { 
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              
            }
          });

          const data = await res.json();

          if (res.status === 200) {
            setBorrowedBooks(data || []);  // Ensure it always sets an array, even if empty
            console.log(data)
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
    }
  }, [authUser, backendUrl]);  // Dependency on authUser to ensure it only runs when available

  if (loading) {
    return <div style={{ display: 'flex', marginLeft:'50px', height: '100%', width: '100%' }}>
              <SearchAnimation />
            </div>;
  }

  return (
    <div className={styles.borr_book}>
      <NextNProgress
        color="#32CD32"       
        startPosition={0.3} 
        stopDelayMs={200}   
        height={3}          
        showOnShallow={true} 
      />
      <h2>Borrowed Books</h2>

      {borrowedBooks.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Title</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Author</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Book Image</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Borrowed On</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Due On</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map((borrowedBook) => (
              <tr key={borrowedBook._id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{borrowedBook.book.TITLE}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{borrowedBook.book.author_name || "Unknown Author"}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <Image src={isValidURL(borrowedBook.book.PHOTO) ? borrowedBook.book.PHOTO : defaultimage} alt={borrowedBook.book.TITLE} className="book-image" width={100} height={100} />
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {new Date(borrowedBook.borrowDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {new Date(borrowedBook.dueDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.borr_book}>
        <p style={{display:'flex', alignItems:'center', justifyContent:'center' , height:'100%', width:'100%'}}>You have no borrowed books.</p>
        </div>
      )}
    </div>
  );
}

Borrowedbook.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};
