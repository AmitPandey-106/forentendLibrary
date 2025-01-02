import Userlayout from '../../../../../u_layout';
import { useEffect, useState } from 'react';
import styles from '@/styles/ebook.module.css';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Others() {
  const [ebooks, setEBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEBooks, setFilteredEBooks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(''); // New state for stream filter
  const [categorys, setCategorys] = useState([]);

  // Fetch eBooks from the backend API
  useEffect(() => {
    const fetchEBooks = async () => {
      try {
        const response = await fetch('https://backendlibrary-2.onrender.com/all-ebooks'); // Adjust the URL based on your backend
        if (!response.ok) {
          throw new Error('Failed to fetch eBooks.');
        }
        const data = await response.json();
        setEBooks(data);
        setFilteredEBooks(data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchCategorys = async () => {
      try {
        const res = await fetch('https://backendlibrary-2.onrender.com/all-categorys'); // Assume an endpoint to get available streams
        const data = await res.json();

        if (res.status === 200) {
          setCategorys(data.category); // Set the available streams
        } else {
          console.error(data.msg || 'Failed to fetch streams');
        }
      } catch (error) {
        console.error('Error fetching streams:', error);
      }
    };

    fetchEBooks();
    fetchCategorys();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = ebooks;
  
      // Apply category filter if selected
      if (categoryFilter) {
        filtered = filtered.filter((book) => book.category === categoryFilter);
      }
  
      // Apply search query filter
      if (searchQuery) {
        filtered = filtered.filter(
          (ebook) =>
            ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ebook.author.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
  
      setFilteredEBooks(filtered);
    };
  
    applyFilters();
  }, [searchQuery, categoryFilter, ebooks]);
  

  // Handle stream filter change
  const onCategorySelect = (e) => {
    setCategoryFilter(e.target.value);
  };

  // Handle search input change
  const onSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Reapply filters whenever searchQuery, streamFilter, or books change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, categoryFilter, ebooks]);

  // Render the component
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Uploaded eBooks</h1>
      {loading && <p>Loading eBooks...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className='' style={{display:'flex',}}>
      <div className="filter-bar" >
        <select onChange={onCategorySelect} value={categoryFilter} style={{width:'150px',height:"30px", fontSize:'18px'}}>
          <option value="">Select Category</option>
          {categorys.map((category) => (
            <option key={category} value={category}>
              {category}
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
      </div>

      <div className={styles.booksRow}>
        {!loading && !error && filteredEBooks.length > 0 ? (
          filteredEBooks.map((ebook) => (
            <div key={ebook._id} className={styles.bookCard}>
              <Image
                src={ebook.coverImage || '/logo.jpg'} // Placeholder image if no cover image is available
                alt={ebook.title}
                className={styles.bookImage}
              />
              <h2 className={styles.bookTitle}>{ebook.title}</h2>
              <p className={styles.bookAuthor}>by {ebook.author}</p>
              <p className={styles.bookCategory}>Category: {ebook.category}</p>
              <p className={styles.bookPrice}>
                Price: {ebook.price === 0 ? 'Free' : `$${ebook.price}`}
              </p>
              <a href={`https://backendlibrary-2.onrender.com/${ebook.file}`} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
                View PDF
              </a>
            </div>

          ))
        ) : (
          <p>No eBooks available</p>
        )}
      </div>
    </div>
  );
}

// Set layout

Others.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};
