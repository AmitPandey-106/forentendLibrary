import React, { useState, useEffect } from "react";
import styles from "../../../../../styles/layout.module.css";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const [showDot, setShowDot] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch member count and pending requests count
  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        const response = await fetch("https://backendlibrary-production.up.railway.app/borrow-requests/count-pending");
        const data = await response.json();
        setShowDot(data.count);  // Set the member count
      } catch (error) {
        console.error("Error fetching member count:", error);
      }
    };

    fetchMemberCount();

    // Poll for updates every 60 seconds (for the pending requests count)
    const interval = setInterval(fetchMemberCount, 60000);
    return () => clearInterval(interval);  // Cleanup interval on unmount
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
      </header>
      <div className={styles.body}>
        <nav className={styles.sidebar}>
          <ul>
            <li>
              <Link href="/component/library/clglibrary/admins/home">Dashboard</Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/member">Members</Link>
            </li>
            {/* Dropdown Menu for Add Books */}
            <li className={styles.dropdown}>
              <div
                className={styles.dropdownToggle}
                onClick={toggleDropdown}
              >
                Add Books
              </div>
              {dropdownOpen && (
                <ul className={styles.dropdownMenu}>
                  <li>
                    <Link href="/component/library/clglibrary/admins/addbook">
                      Add Books
                    </Link>
                  </li>
                  <li>
                    <Link href="/component/library/clglibrary/admins/addebook">
                      Add E-Books
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/viewbook">View Books</Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/updatebook">Update borrows</Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/getbrequest">
                Request Book
                {showDot && <span className={styles.blueDot}></span>}
              </Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/adminborrow">Admin Borrow</Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/history">History</Link>
            </li>
            <li>
              <Link href="/component/library/clglibrary/admins/penalties">Penalties</Link>
            </li>
          </ul>
        </nav>

        <main className={styles.main}>
          {children}
        </main>
      </div>

      <footer className={styles.footer}>
        <p>© 2024 Infinity.technology All rights reserved.</p>
      </footer>
    </div>
  );
}
