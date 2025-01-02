import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

export default function SearchItems() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = useCallback(async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://backendlibrary-2.onrender.com/get-clg-books`);
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setSearchResults((prevBooks) => [...prevBooks, ...data.clgbooks]);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    }, []);
  
    useEffect(() => {
      fetchBooks();
    }, [fetchBooks]);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://backendlibrary-2.onrender.com/search-books?query=${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      setSearchResults(data.searchbook);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="search-results">
        {loading ? (
          <p>Loading...</p>
        ) : searchResults.length > 0 ? (
          searchResults.map((book) => (
            <div key={book._id} className="search-result">
              <Image src={book.photo || 'defaultimage'} alt={book.TITLE} />
              <div>
                <h3>{book.TITLE}</h3>
                <p>Author: {book.authorName}</p>
                <p>Available: {book.TOTAL_VOL}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
      <style jsx>{`
        .search-container {
          padding: 20px;
        }

        .search-bar input {
          padding: 10px;
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .search-results {
          margin-top: 20px;
        }

        .search-result {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .search-result img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          margin-right: 10px;
        }

        .search-result div {
          flex: 1;
        }

        .search-result h3 {
          margin: 0;
          font-size: 18px;
        }

        .search-result p {
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
}
