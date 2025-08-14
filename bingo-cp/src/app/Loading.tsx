'use client';

import { useEffect, useState } from 'react';

export default function Loading() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      height: '40vh',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      fontWeight: 'bold',
    }}>
      Loading problems{dots}
    </div>
  );
}
