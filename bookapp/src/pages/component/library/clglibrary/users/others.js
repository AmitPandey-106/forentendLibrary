import Userlayout from '../../../../../u_layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import NextNProgress from 'nextjs-progressbar';

export default function Others() {
  const [ebooks, setEBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState('viewbook');
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    const fetchEBooks = async () => {
      try {
        const response = await fetch(`${backendUrl}/all-ebooks`);
        if (!response.ok) {
          throw new Error('Failed to fetch eBooks.');
        }
        const data = await response.json();
        setEBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEBooks();
  }, [backendUrl]);

  const handleComponent = (value) => {
    setSelectedOption(value);
    router.push(`/component/library/clglibrary/admins/${value}`);
  };

  useEffect(() => {
    const currentPath = router.pathname.split('/').pop();
    setSelectedOption(currentPath);
  }, [router.pathname]);

  return (
    <div style={{ width: '100%', padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <NextNProgress color="#32CD32" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} />
      <h1 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#333', padding: '20px 0' }}>Uploaded eBooks</h1>
      {loading && <p>Loading eBooks...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ margin: '10px 0' }}>
        <select
          style={{ margin: "0px 10px", padding: '5px 10px', fontSize: '20px' }}
          value={selectedOption}
          onChange={(e) => handleComponent(e.target.value)}
        >
          <option value="novel">Novel</option>
          <option value="story">Story</option>
        </select>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'center', marginTop: '20px' }}>
        {!loading && !error && ebooks.length === 0 && <p>No eBooks uploaded yet.</p>}
        {!loading && !error && ebooks.length > 0 ? (
          ebooks.map((ebook) => (
            <div key={ebook._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '6px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: '200px', transition: 'transform 0.3s ease' }}>
              <Image src={ebook.coverImage} alt={ebook.title} width={250} height={350} style={{ borderRadius: '10px', marginBottom: '10px' }} />
              <h2 style={{ fontSize: '16px', color: '#333', margin: '1px 0', fontWeight: 'bold' }}>{ebook.title}</h2>
              <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>by {ebook.author}</p>
              <p style={{ fontSize: '14px', color: '#4CAF50', fontWeight: 'bold' }}>Category: {ebook.category}</p>
              <p style={{ fontSize: '14px', fontWeight: 'bold' }}>Price: {ebook.price === 0 ? 'Free' : `$${ebook.price}`}</p>
              <a href={`${backendUrl}/${ebook.file}`} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>View PDF</a>
            </div>
          ))
        ) : (
          <p>No eBooks available</p>
        )}
      </div>
    </div>
  );
}

Others.getLayout = function getLayout(page) {
  return <Userlayout>{page}</Userlayout>;
};
