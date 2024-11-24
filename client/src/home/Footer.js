import React from 'react';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className='boxed footer-body'>
        <div className='footer-items'>
          <div className="footer-item">
            <h6 className="footer-heading">משתתפים</h6>
            <ul className="footer-list">
              <li><a className="footer-link">יוסי קריב</a> </li>
              <li><a className="footer-link">אלדר אברמוביץ</a> </li>
              <li><a className="footer-link">בר פררה</a></li>
              <li><a className="footer-link">אורלי איסקוב</a></li>
            </ul>
          </div>

          <div className="footer-item">
            <h6 className="footer-heading">קישורים שימושיים</h6>
            <ul className="footer-list">
              <li><a className="footer-link">ראשי</a></li>
              <li><a className="footer-link">עמותות</a></li>
              <li><a className="footer-link">מתנדבים</a> </li>
              <li><a className="footer-link">צור קשר</a></li>
            </ul>
          </div>

          <div className="footer-item">
            <h6 className="footer-heading">צור קשר</h6>
            <ul className="footer-list">
              <li>
                <span className="footer-icon">&#128506;</span>
                באר שבע, בזל - סמי שמעון
              </li>
              <li>
                <span className="footer-icon">&#x2709;</span>
                Admin@GivesHand.com
              </li>
              <li>
                <span className="footer-icon">☎</span>
                + 972 234 567 88
              </li>
              <li>
                <span className="footer-icon">☎</span>
                + 972 234 333 89
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-buttom">
          <p className="text-muted"> &copy; 2021 GivesHand -  All rights reserved.</p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;