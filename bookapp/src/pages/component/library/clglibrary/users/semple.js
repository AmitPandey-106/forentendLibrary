// import React, { useState, useEffect, useRef } from 'react';
// import Userlayout from '../../../../../u_layout';
// import { useRouter } from 'next/router';
// import Image from 'next/image';

// export default function Home() {
//   const router = useRouter();
//   const [books, setBooks] = useState([]);
//   const [query, setQuery] = useState('');
//   const [subject, setSubject] = useState('');
//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [page, setPage] = useState(1);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const inputRef = useRef(null);
//   const defaultimage = 'https://th.bing.com/th/id/OIP.3J5xifaktO5AjxKJFHH7oAAAAA?rs=1&pid=ImgDetMain';

//   // Fetch books from the API
//   const fetchBooks = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`http://localhost:8000/get-clg-books`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch books');
//       }
//       const data = await response.json();
//       setBooks(data.clgbooks);
//     } catch (error) {
//       console.error('Error fetching books:', error);
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   // Fetch subjects from the API for autocomplete
//   // const fetchSubjects = async () => {
//   //   try {
//   //     const response = await fetch('http://localhost:8000/subjects');
//   //     if (!response.ok) {
//   //       throw new Error('Failed to fetch subjects');
//   //     }
//   //     const data = await response.json();
//   //     setSubjects(data.map((subject) => subject.SUB_NAME)); // Extract the name property
//   //   } catch (error) {
//   //     console.error('Error fetching subjects:', error);
//   //   }
//   // };

//   useEffect(() => {
//     fetchBooks();
//     // fetchSubjects(); 
//   }, [page]);

//   // Handle search input change
//   const handleSearchChange = async (e) => {
//     setQuery(e.target.value);
//     if (e.target.value.trim() === '') {
//       fetchBooks();
//     } else {
//       setLoading(true);
//       try {
//         const response = await fetch(`http://localhost:8000/search-books?query=${e.target.value}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch books');
//         }
//         const data = await response.json();
//         setBooks(data.searchbook);
//       } catch (error) {
//         console.error('Error fetching books:', error);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   // Handle subject input change with autocomplete
//   const handleSubjectChange = (e) => {
//     setSubject(e.target.value);
//     console.log(e.target.value)
//     // setShowSuggestions(true);
//     // console.log(showSuggestions)
//   };
//   const handleSubjectSelect = (selectedSubject) => {
//     console.log(selectedSubject)
//     setSubject(selectedSubject); // Set the selected subject to input field
//     setShowSuggestions(false); // Hide suggestions
//     fetchBooksForSubject(selectedSubject); // Call API to fetch books for the selected subject
//   };

//   const fetchBooksForSubject = async (selectedSubject) => {
//     setLoading(true);
//     try {
//         const response = await fetch(`http://localhost:8000/filter-books?subname=${selectedSubject}`);
//         if (!response.ok) {
//             throw new Error('Failed to fetch books');
//         }
//         const data = await response.json();
//         setBooks(data); // Set books directly from the response data
//     } catch (error) {
//         console.error('Error fetching books:', error);
//     } finally {
//         setLoading(false);
//     }
// };
  
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (inputRef.current && !inputRef.current.contains(event.target)) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleScroll = () => {
//     if (query.trim() || subject.trim()) return;
//     const scrollHeight = document.documentElement.scrollHeight;
//     const scrollTop = document.documentElement.scrollTop;
//     const clientHeight = window.innerHeight;

//     if (scrollTop + clientHeight >= scrollHeight - 100 && !loadingMore) {
//       setLoadingMore(true);
//       setPage((prevPage) => prevPage + 1);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, [loadingMore, handleScroll]);

//   const handleBookClick = (book) => {
//     router.push({
//       pathname: `/component/library/clglibrary/admins/${book._id}/bookdetails`,
//     });
//   };

//   return (
//     <div className="books-container">
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Search books by title or author..."
//           value={query}
//           onChange={handleSearchChange}
//         />
//         <input
//           type="text"
//           placeholder="Search by subject..."
//           value={subject}
//           onChange={handleSubjectChange}
//           onFocus={() => setShowSuggestions(true)} // Show suggestions when input gains focus
//           ref={inputRef}
//         />
//         {showSuggestions && (
//           <div className="suggestions">
//             {subjects
//               .filter((s) => typeof s === "string" && s.toLowerCase().includes(subject.toLowerCase()))
//               .map((suggestion, index) => (
//                 <div
//                   key={index}
//                   onClick={() => handleSubjectSelect(suggestion)}
//                   className="suggestion-item"
//                 >
//                   {suggestion}
//                 </div>
//               ))}

//           </div>
//         )}
//       </div>
//       {loading && <p>Loading...</p>}

//       <div className="books-row">
//         {books.length > 0 ? (
//           books.map((book) => (
//             <div
//               key={book._id}
//               className="book-card"
//               onClick={() => handleBookClick(book)}
//             >
//               <Image src={defaultimage} alt={book.TITLE} className="book-image" />
//               <h2 className="book-title">{book.TITLE}</h2>
//               <p className="book-author">by {book.authorName}</p>
//               <p className="book-quantity">Available: {book.TOTAL_VOL}</p>
//             </div>
//           ))
//         ) : (
//           <p>
//             {query.trim() || subject.trim()
//               ? 'No books found'
//               : 'Start typing to search for books'}
//           </p>
//         )}

//         {loadingMore && <p>Loading more books...</p>}
//       </div>

//       <style jsx>{`
//         .books-container {
//           padding: 20px;
//           max-width: 1400px;
//           margin: 0 auto;
//         }

//         .search-bar {
//           margin-bottom: 20px;
//           text-align: center;
//           position: relative;
//         }

//         .search-bar input {
//           padding: 10px;
//           width: 100%;
//           max-width: 600px;
//           border: 1px solid #ddd;
//           border-radius: 4px;
//           font-size: 16px;
//           margin-bottom: 10px;
//         }

//         .suggestions {
//           position: absolute;
//           background: #fff;
//           border: 1px solid #ddd;
//           border-radius: 4px;
//           width: 100%;
//           max-width: 600px;
//           z-index: 10;
//           max-height: 200px;
//           overflow-y: auto;
//           text-align: left;
//         }

//         .suggestion-item {
//           padding: 10px;
//           cursor: pointer;
//           border-bottom: 1px solid #eee;
//         }

//         .suggestion-item:hover {
//           background: #f0f0f0;
//         }

//         .suggestion-item:last-child {
//           border-bottom: none;
//         }

//         .books-row {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 20px;
//           justify-content: flex-start;
//         }

//         .book-card {
//           background: #fff;
//           border: 1px solid #ddd;
//           border-radius: 8px;
//           padding: 15px;
//           text-align: center;
//           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//           max-width: 300px;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           transition: box-shadow 0.3s ease, transform 0.3s ease;
//         }

//         .book-card:hover {
//           box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
//           transform: translateY(-5px);
//         }

//         .book-image {
//           width: 100%;
//           height: auto;
//           max-height: 300px;
//           object-fit: cover;
//           border-radius: 5px;
//           margin-bottom: 10px;
//         }

//         .book-title {
//           font-size: 16px;
//           color: #333;
//           margin: 5px 0;
//           font-weight: bold;
//         }

//         .book-author {
//           font-size: 14px;
//           color: #666;
//           margin: 5px 0;
//         }

//         .book-quantity {
//           font-size: 14px;
//           color: #444;
//           margin: 5px 0;
//         }
//       `}</style>
//     </div>
//   );
// }

// Home.getLayout = function getLayout(page) {
//   return <Userlayout>{page}</Userlayout>;
// };

