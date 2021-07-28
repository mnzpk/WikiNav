import React from 'react';

const Instruction = ({ className, children }) => (
  <div className={`instruction ${className}`}>{children}</div>
);

export default Instruction;
