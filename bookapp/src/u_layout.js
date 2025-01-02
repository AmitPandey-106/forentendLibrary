import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/usernav.module.css'

export default function Userlayout({ children}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [results, setResults] = useState([]);
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleSearch = async (e) => {
    setQuery(e.target.value)
  };

  return (
    <div className='container'>    
    <>
      {/* Desktop Navbar */}
      <nav className={styles.desktop_navbar}>
        <div className={styles.logo}>
          <Link href="/">Library</Link>
        </div>
        <ul className={styles.nav_links}>
  <>
    <li><Link href="/component/library/clglibrary/users/home">Home</Link></li>

    {/* Dropdown for Books */}
    <li className={styles.dropdown}>
      <Link href="#">Books</Link>
      <ul className={styles.dropdown_menu}>
        <li><Link href="/component/library/clglibrary/users/clgbooks">All Books</Link></li>
        <li><Link href="/component/library/clglibrary/users/Ebooks">E-books</Link></li>
        <li><Link href="/component/library/clglibrary/users/Journal">Journal</Link></li>
        <li><Link href="/component/library/clglibrary/users/others">others</Link></li>
      </ul>
    </li>

    <li><Link href="/component/library/clglibrary/users/profile">Profile</Link></li>
    <li><Link href="/components/about">About</Link></li>
    <li><Link href="/auth/signin">Signin</Link></li>
  </>
</ul>

      </nav>

      {/* Mobile Navbar */}
      <nav className={styles.mobile_navbar}>
        <div className={styles.logo}>
          <Link href="/">Library</Link>
        </div>
        <div className={styles.search_container}>
          <input
            className={styles.input}
            type="text"
            placeholder="Search..."
            value=""
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button >Search</button>
        </div>
        <div className={styles.hamburger} onClick={toggleMenu}>
          &#9776;
        </div>

        {/* Sidebar Menu for mobile */}
        <div className={`${styles.sidebar} ${menuOpen ? styles.open : ''}`}>
          <button className={styles.close_btn} onClick={closeMenu}>×</button>
          <ul className={styles.nav_links}>
              <>
                <li onClick={closeMenu}><Link href="/component/library/clglibrary/users/home">Home</Link></li>
                <li onClick={closeMenu}><Link href="/component/library/clglibrary/users/profile">Profile</Link></li>
                <li onClick={closeMenu}><Link href="/components">Books</Link></li>
                <li onClick={closeMenu}><Link href="/components/about/">About</Link></li>
                <li onClick={closeMenu}><Link href="/auth/signin">Signin</Link></li>
              </>
          </ul>
        </div>
      </nav>
    </>
    {/* <main className={styles.main}> */}
        {children}
    {/* </main> */}
    <footer className={styles.footer}>
    <p>© 2024 Infinity.technology All rights reserved.</p>
    </footer>
    </div>
  )
}
