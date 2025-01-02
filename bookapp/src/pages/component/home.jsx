import Layout from "../../layout";
import Image from "next/image";

export default function Home() {
  return (
    <Layout>
      <div 
      style={{
        backgroundImage: `url('/library.jpg')`,
        backgroundSize: 'cover', // Ensures the image covers the entire container
        backgroundPosition: 'center', // Centers the image
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center'
      }}
    >
      {/* Text Overlay */}
      <div>
        <h1>Welcome to the Library</h1>
        <p>Explore our collection of books and resources</p>
      </div>
    </div>
    </Layout>
  );
}
