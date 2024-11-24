//Popup.js
import React from 'react';
import '../css/Popup.css';

function Popup({ isOpen, onClose, children, isEvent }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}></button>
        {React.cloneElement(children, { onClose })}
      </div>
    </div>
  );
}

export default Popup;
