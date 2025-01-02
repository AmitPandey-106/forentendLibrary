import React, { useState, useEffect } from 'react';
import Userlayout from '../../../../../u_layout';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false); // Set loading to false initially
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
    const fetchBooks = async () => {
      setLoading(true); // Show loading until data is fetched
      try {
        const response = await fetch('backendlibrary-production.up.railway.app/get-clg-books?startIndex=10&endIndex=20'); // Adjust the API endpoint as needed
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data.clgbooks); // Directly set the fetched books
      } catch (err) {
        console.error('Error fetching books:', err.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchBooks();
  }, []);

  const handleBookClick = (book) => {
    router.push({
      pathname: `/component/library/clglibrary/admins/${book._id}/bookdetails`,
    });
  };

  return (
    <div className="books-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books by title or author..."
          onClick={() => router.push('/component/library/clglibrary/users/searchitems')}
        />
      </div>
      <div className="books-row">
        {loading ? (
          <p>Loading books...</p> // Show loading while fetching
        ) : books.length > 0 ? (
          books.map((book) => (
            <div
              key={book._id}
              className="book-card"
              onClick={() => handleBookClick(book)}
            >
              <Image src={isValidURL(book.PHOTO) ? book.PHOTO : defaultimage} alt={book.TITLE} className="book-image" />
              <h2 className="book-title">{book.TITLE}</h2>
              <p className="book-author">by {book.authorName}</p>
              <p className="book-quantity">Available: {book.TOTAL_VOL}</p>
            </div>
          ))
        ) : (
          <p>No books found</p> // Show only if books array is empty after loading
        )}
      </div>
      <style jsx>{`
        .books-container {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .search-bar {
          margin-bottom: 20px;
          text-align: center;
        }

        .search-bar input {
          padding: 10px;
          width: 100%;
          max-width: 600px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .books-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: flex-start;
        }

        .book-card {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .book-card:hover {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-5px);
        }

        .book-image {
          width: 100%;
          height: auto;
          max-height: 300px;
          object-fit: cover;
          border-radius: 5px;
          margin-bottom: 10px;
        }

        .book-title {
          font-size: 16px;
          color: #333;
          margin: 5px 0;
          font-weight: bold;
        }

        .book-author {
          font-size: 14px;
          color: #666;
          margin: 5px 0;
        }

        .book-quantity {
          font-size: 14px;
          color: #4CAF50;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};
