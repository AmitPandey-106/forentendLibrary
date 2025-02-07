import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/usernav.module.css'
import Image from 'next/image';
import NextNProgress from 'nextjs-progressbar';


export default function Userlayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [results, setResults] = useState([]);
  const router = useRouter();
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown state
  };

  const closeDorpMenu = () => {
    setDropdownOpen(false); // Close dropdown when an item is clicked
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleSearch = async (e) => {
    setQuery(e.target.value)
  };

  return (
    <div className={styles.container}>
      <NextNProgress
        color="#32CD32"       
        startPosition={0.3} 
        stopDelayMs={200}   
        height={3}          
        showOnShallow={true} 
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
      <>
        {/* Desktop Navbar */}
        <nav className={styles.desktop_navbar}>
          <div className={styles.logo}>
            <Link href="/">library</Link>
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
              <li><Link href="/component/library/clglibrary/users/history">History</Link></li>
            </>
          </ul>

        </nav>

        {/* Mobile Navbar */}
        <nav className={styles.mobile_navbar}>
          <div className={styles.logo}>
            <Link href="/">Library</Link>
          </div>

          <div className={styles.hamburger} onClick={toggleMenu}>
            &#9776;
          </div>

          {/* Sidebar Menu for mobile */}
          <div className={`${styles.sidebar} ${menuOpen ? styles.open : ''}`}>
            <button className={styles.close_btn} onClick={closeMenu}>×</button>

            <div className={styles.slide}>
              <div className={styles.upper}>
                <Image className={styles.slideimage} src='/logo.jpg' alt='user' height={74} width={74}></Image>
              </div>
              <ul className={styles.nav_links}>
                <>
                  <div className={styles.ic}>
                    <i className="fas fa-home"></i>
                    <li onClick={closeMenu}><Link href="/component/library/clglibrary/users/home">Home</Link></li>
                  </div>
                  {/* <hr className={styles.line}></hr> */}
                  <div className={styles.ic}>
                    <i className="fas fa-user"></i>
                    <li onClick={closeMenu}><Link href="/component/library/clglibrary/users/profile">Profile</Link></li>
                  </div>

                  <div className={styles.icb}>
                    <i className="fas fa-book"></i>
                    <li
                      className={styles.M_dropdown}
                      onClick={toggleDropdown}
                    >
                      Books
                      {dropdownOpen && (
                        <ul className={styles.M_dropdown_menu}>
                          <li onClick={closeMenu}>
                            <Link href="/component/library/clglibrary/users/clgbooks">All Books</Link>
                          </li>
                          <li onClick={closeMenu}>
                            <Link href="/component/library/clglibrary/users/Ebooks">E Books</Link>
                          </li>
                          <li onClick={closeMenu}>
                            <Link href="/component/library/clglibrary/users/borrowedbook">Borrowed Books</Link>
                          </li>
                          <li onClick={closeMenu}>
                            <Link href="/component/library/clglibrary/users/history">History</Link>
                          </li>
                        </ul>
                      )}
                    </li>
                  </div>
                  <div className={styles.ic}>
                    <i className="fas fa-info-circle"></i>
                    <li onClick={closeMenu}><p><Link href="/component/about">About Us</Link></p></li>
                  </div>
                  <div className={styles.ic}>
                    <i className="fas fa-right-to-bracket"></i>
                    <li onClick={closeMenu}><Link href="/auth/librarysignin">Signin</Link></li>
                  </div>
                </>
              </ul>
            </div>
          </div>
        </nav>
      </>
      {/* <main className={styles.main}> */}
      {children}
      {/* </main> */}
      <footer className={styles.footer}>
        <div className={styles.f_div}>

          {/* About Section */}
          <div className={styles.f_about}>
            <h3>BooksEra</h3>
            <p>Suntouch Technology is dedicated to delivering top-notch tech solutions to empower businesses worldwide.</p>
            <a href="https://www.googlemaps.com" target="_blank" rel="noopener noreferrer">
              <Image src="/location.png" alt="Facebook" width={24} height={35} />
            </a>
          </div>

          <div className={styles.nav_con}>
            <div className={styles.navigation}>
              <h3>Navigation</h3>
              <p><Link href="/component/library/clglibrary/users/home">Home</Link></p>
              <p><Link href="/component/library/clglibrary/users/clgbooks">All Books</Link></p>
              <p><Link href="/component/about">About Us</Link></p>
              <p><Link href="https://posts-sigma-eight.vercel.app">UserExchange</Link></p>
            </div>

            {/* Contact Us Section */}
            <div className={styles.contact}>
              <h3>Contact Us</h3>
              <p>Email: suntouchtechnology01@gmail.com</p>
              <p>Phone: +91 7506541325</p>
              <p>Address: 295, Chembur, Maharashtra - 74</p>
            </div>
          </div>


          {/* Services Section */}
          <div className={styles.ser_foll}>
            <div className={styles.f_services}>
              <h3>Services</h3>
              <ul>
                <li>Web Development</li>
                <li>App Development</li>
                <li>Cloud Services</li>
              </ul>
            </div>

            {/* Social Media Links */}
            <div className={styles.social_media}>
              <h3>Follow Us</h3>
              <div className={styles.icons}>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <Image src="/facebook.png" alt="Facebook" width={24} height={24} /> Facebook
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                  <Image src="/twitter.png" alt="Twitter" width={24} height={24} /> Twitter
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Image src="/linkedin-logo.png" alt="LinkedIn" width={24} height={24} /> LinkedIn
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <Image src="/instagram.png" alt="Instagram" width={24} height={24} /> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
        <p>© 2025 SunTouch Technology All rights reserved.</p>
      </footer>

    </div>
  )
}
