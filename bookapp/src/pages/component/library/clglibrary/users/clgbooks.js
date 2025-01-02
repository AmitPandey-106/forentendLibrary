import React, { useState, useEffect, useRef } from 'react';
import Userlayout from '../../../../../u_layout';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useCallback } from 'react';

export default function ClgBooks() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const defaultimage = 'https://th.bing.com/th/id/OIP.3J5xifaktO5AjxKJFHH7oAAAAA?rs=1&pid=ImgDetMain';
  const subjectInputRef = useRef(null);
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
   };

   const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`backendlibrary-production.up.railway.app/get-clg-books?page=${currentPage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(data.clgbooks);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await fetch('backendlibrary-production.up.railway.app/subjects');
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }
      const data = await response.json();
      setSubjects(data.map((subject) => subject.SUB_NAME));
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  }, []); 

  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setSubject(value);

    if (value.trim() === '') {
      // If subject input is cleared, fetch all books
      fetchBooks();
      setShowSuggestions(false); // Hide suggestions
    } else {
      setShowSuggestions(true);
    }
  };

  const handleSubjectSelect = (selectedSubject) => {
    setSubject(selectedSubject); // Set the selected subject to the input
    setShowSuggestions(false); // Hide the suggestions dropdown
  };

  const searchBooks = async () => {
    setLoading(true);
    try {
      const url = `backendlibrary-production.up.railway.app/search-by-filter?subname=${subject}&query=${query}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to search books');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchSubjects();
  }, [currentPage, fetchBooks, fetchSubjects]);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        subjectInputRef.current &&
        !subjectInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="books-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div ref={subjectInputRef} className="subject-input-container">
          <input
            type="text"
            placeholder="Search by subject..."
            value={subject}
            onChange={handleSubjectChange}
            onFocus={() => setShowSuggestions(true)}
          />
          {showSuggestions && (
            <div className="suggestions">
              {subjects
                .filter((s) =>
                  typeof s === 'string' && s.toLowerCase().includes(subject.toLowerCase())
                )
                .map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSubjectSelect(suggestion)}
                    className="suggestion-item"
                  >
                    {suggestion}
                  </div>
                ))}
            </div>
          )}
        </div>
        <button
          className="submit-button"
          onClick={searchBooks}
        >
          Search
        </button>
      </div>
      {loading && <p>Loading...</p>}

      <div className="books-row">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book._id} className="book-card" onClick={() => handleBookClick(book)}>
              <Image
                src={isValidURL(book.PHOTO) ? book.PHOTO : defaultimage}
                alt={book.TITLE}
                className="book-image"
              />
              <h2 className="book-title">{book.TITLE}</h2>
              <p className="book-author">by {book.authorName || 'Unknown Author'}</p>
              <p className="book-quantity">Available: {book.TOTAL_VOL}</p>
            </div>
          ))
        ) : (
          <p>No Book found</p>
        )}

        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
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
          position: relative;
        }

        .search-bar input {
          padding: 10px;
          width: 100%;
          max-width: 600px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          margin-bottom: 10px;
        }

        .submit-button {
          padding: 10px 20px;
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        .submit-button:hover {
          background: #0056b3;
        }

        .suggestions {
          position: absolute;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 100%;
          max-width: 600px;
          z-index: 10;
          max-height: 200px;
          overflow-y: auto;
          text-align: left;
        }

        .suggestion-item {
          padding: 10px;
          cursor: pointer;
          border-bottom: 1px solid #eee;
        }

        .suggestion-item:hover {
          background: #f0f0f0;
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
          color: #444;
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
}

ClgBooks.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};
