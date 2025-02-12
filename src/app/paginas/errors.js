// src/app/error.js
"use client";

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Ocurrió un error</h1>
      <p>{error?.message || 'Algo salió mal.'}</p>
      <button onClick={() => reset()} style={{ color: '#0070f3' }}>
        Reintentar
      </button>
    </div>
  );
}
