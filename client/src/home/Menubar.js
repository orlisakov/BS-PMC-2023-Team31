import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Menubar.css';

const Menubar = () => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="menu-bar boxed">
        <ul>
          <li onClick={() => handleClick('/')}><a>ראשי</a></li>
          <li onClick={() => handleClick('/about')}><a>אודות</a></li>
          <li onClick={() => handleClick('/Associations')}><a>עמותות</a></li>
          <li onClick={() => handleClick('/events')}><a>אירועים</a></li>
          <li onClick={() => handleClick('/contact')}><a>צור קשר</a></li>      
        </ul>
    </div>
  );
};

export default Menubar;