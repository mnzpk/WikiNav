import React from 'react';
import { ScaleLoader } from 'react-spinners';

export default function Loader() {
  return (
    <div className="loader-container">
      <ScaleLoader color="#000" loading size={150} />
    </div>
  );
}
