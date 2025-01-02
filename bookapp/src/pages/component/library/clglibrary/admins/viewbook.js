// pages/viewBooks.js
import AdminLayout from './layout';
import Userlayout from '@/u_layout';
import { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AuthContext } from '@/pages/component/context/authcontext';

export default function AdminViewBook() {
  const { authUser } = useContext(AuthContext)
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([])
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const [totalPages, setTotalPages] = useState(1); // Total pages state
  // const [selectedOption, setSelectedOption] = useState('viewbook');
  // const [searchQuery, setSearchQuery] = useState('');
  // const [filteredBooks, setFilteredBooks] = useState([]);
  // const [streamFilter, setStreamFilter] = useState(''); // New state for stream filter
  // const [streams, setStreams] = useState([]);
  const defaultimage = 'https://th.bing.com/th/id/OIP.3J5xifaktO5AjxKJFHH7oAAAAA?rs=1&pid=ImgDetMain';
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
   };

  const Layout = authUser.role === 'user' ? Userlayout : AdminLayout;

  useEffect(() => {
    const fetchBooks = async () => {
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
    };

    fetchBooks();
  }, [currentPage]);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // const applyFilters = () => {
  //   let filtered = books;

  //   // Apply stream filter if selected
  //   if (streamFilter) {
  //     filtered = filtered.filter((book) => book.stream === streamFilter);
  //   }

  //   // Apply search query filter
  //   if (searchQuery) {
  //     filtered = filtered.filter(
  //       (book) =>
  //         book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         book.author.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   }

  //   setFilteredBooks(filtered);
  // };

  // // Handle stream filter change
  // const onStreamSelect = (e) => {
  //   setStreamFilter(e.target.value);
  // };

  // // Handle search input change
  // const onSearchChange = (e) => {
  //   setSearchQuery(e.target.value);
  // };

  // // Reapply filters whenever searchQuery, streamFilter, or books change
  // useEffect(() => {
  //   applyFilters();
  // }, [searchQuery, streamFilter, books]);

  // Search books by query
  // const onSearchChange = async (e) => {
  //   const query = e.target.value;
  //   setSearchQuery(query);

  //   try {
  //     const response = await fetch(`http://localhost:8000/search-books?query=${query}`);
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch search results');
  //     }

  //     const data = await response.json();
  //     setFilteredBooks(data.books);
  //   } catch (error) {
  //     console.error('Error fetching search results:', error);
  //     setFilteredBooks([]);
  //   }
  // };

  const handleBookClick = (book) => {
    router.push({
      pathname: `/component/library/clglibrary/admins/${book._id}/bookdetails`
    });
  };

  const handleComponent = (value) => {
    setSelectedOption(value); // Update the selected option in state
    router.push(`/component/library/clglibrary/admins/${value}`); // Navigate to the respective page
  };

  // useEffect(() => {
  //   const currentPath = router.pathname.split('/').pop(); // Get the last part of the path
  //   setSelectedOption(currentPath);
  // }, [router.pathname]);

  return (
    <Layout>
      <div className="books-container">
        <h1 className="title">Available Books</h1>
        {/* <div style={{ margin: '10px 10px', display:'flex', }}>
        <select
          style={{ margin: "0px 10px", padding:'5px 10px', fontSize:'20px' }}
          value={selectedOption}
          onChange={(e) => handleComponent(e.target.value)}
        >
          <option value="viewbook">All Book</option>
          <option value="viewebook">All E-Book</option>
          <option value="novel">Novel</option>
          <option value="story">Story</option>
        </select>
        <div className="filter-bar">
        <select onChange={onStreamSelect} value={streamFilter}>
          <option value="">Select Stream</option>
          {streams.map((stream) => (
            <option key={stream} value={stream}>
              {stream}
            </option>
          ))}
        </select>
      </div>
        <div className="search-bar">
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={searchQuery}
          onChange={onSearchChange}
          style={{width:'300px', padding:'5px 10px'}}
        />
      </div>
      </div> */}
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

        .title {
          text-align: center;
          font-size: 28px;
          color: #333;
          margin-bottom: 20px;
        }

        .books-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: flex-start; /* Align books to the left */
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
          max-height: 250px;
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
    </Layout>
  );
}

