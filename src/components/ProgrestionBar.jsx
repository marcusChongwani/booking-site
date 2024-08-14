import React from 'react';


const ProgressBar = ({ percent, filledBackground, height }) => {
  return (
    <div className="progress-bar-container" style={{ height }}>
      <div
        className="progress-bar-fill"
        style={{ width: `${percent}%`, background: filledBackground }}
      />
    </div>
  );
};

export default ProgressBar;
