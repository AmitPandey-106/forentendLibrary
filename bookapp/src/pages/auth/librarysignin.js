import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/auth.module.css';
import Link from 'next/link';
import { AuthContext } from '../component/context/authcontext';


export default function LibrarySignin({ initialError }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(initialError || '');
  const [success, setSuccess] = useState('');
  const { setProfile } = useContext(AuthContext);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:8000/auth/signin-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.status === 200) {
        const { token, role } = data;

        // Save the token in localStorage
        localStorage.setItem('token', token);

        // Route based on user role
        if (role === 'user') {
          // console.log(data.profile)
          setSuccess(data.msg);
          setProfile(data.profile)
          router.push("/component/library/clglibrary/users/home");
        } else if (role === 'admin') {
          setSuccess(data.msg);
          router.push("/component/library/clglibrary/admins/home");
        } else {
          setError("Invalid role.");
        }
      } else {
        setError(data.err || "Signin failed");
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Sign In</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <div className={styles.element}>
          <label className={styles.title}>Member Number</label>
          <input
            className={styles.input}
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.element}>
          <label className={styles.title}>Password</label>
          <input
            className={styles.input}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className={styles.button} type="submit">Sign In</button>
        <Link href={"/component/library/publiclibrary/publiclibrary"}>Skip to public library ...</Link>
        <p>
        <a href="#" onClick={() => router.push('/component/library/clglibrary/users/forgetpass')} style={{color:'blue'}}>
          Forgot Password?
        </a>
      </p>
      </form>
    </div>
  );
}

// Server-side function to provide initial error if needed
export async function getServerSideProps(context) {
  return {
    props: {
      initialError: '', // Pass any initial error messages or other data as props
    },
  };
}
