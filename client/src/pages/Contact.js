import React, { useState, useEffect, useContext } from 'react';
import '../css/Contact.css';
import { db } from '../config/firebaseClient';
import UserContext from '../UserContext';


const Contact = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { currentUser } = useContext(UserContext);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'association') {
        setName(currentUser.associationName);
        setEmail(currentUser.associationEmail);
      } else if (currentUser.role === 'volunteer') {
        setName(`${currentUser.firstname} ${currentUser.lastname}`);
        setEmail(currentUser.email);
      }
    } else {
      setName('');
      setEmail('');
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const messageData = {
      senderName: name,
      senderEmail: email,
      message: message,
    };

    try {
      const response = await fetch('http://localhost:5000/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Clear the message field
      setMessage('');
      alert('Your message has been sent!');
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };


  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="contact">
      <h2>צור קשר</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <h3>שם מלא</h3>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={currentUser ? null : handleNameChange}
          required
          readOnly={!!currentUser}
        />

        <h3>אימייל</h3>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={currentUser ? null : handleEmailChange}
          required
          readOnly={!!currentUser}
        />
        <h3>הודעה</h3>
        <textarea row='8' id="message" name="message" value={message} onChange={e => setMessage(e.target.value)} required></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Contact;