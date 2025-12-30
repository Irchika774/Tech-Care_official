import { useEffect } from 'react';

const LithosquareLanding = () => {
  useEffect(() => {
    // Redirect to the static HTML file
    window.location.href = '/techcare.html';
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Loading...</h1>
        <p>Redirecting to Tech-Care Landing Page</p>
      </div>
    </div>
  );
};

export default LithosquareLanding;
