// EventDetail.js
import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../UserContext';
import '../css/EventDetail.css';

function EventDetail({ eventId, onClose }) {
  const { currentUser } = useContext(UserContext);
  const [EventDetail, setEventDetail] = useState(null);

  console.log(currentUser);
  useEffect(() => {
    fetch(`/events/${eventId}`)
      .then((response) => response.json())
      .then((data) => setEventDetail(data))
      .catch((error) => console.error('Error:', error));
  }, [eventId]);

  const handleJoin = () => {
    if (!currentUser) {
      alert("עליך להיות מחובר על מנת להצטרף לאירוע");
      return;
    }

    fetch('http://localhost:5000/events/joinEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId: eventId,
        userId: currentUser.uid,
        volunteerFirstName: currentUser.firstname,
        volunteerLastName: currentUser.lastname,
        volunteerEmail: currentUser.email,
        volunteerPhone: currentUser.mobilePhone,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        onClose(); // call the onClose function here
      })
      .catch((error) => alert("בעיה בהצטרפות לאירוע, יש לנסות שנית מאוחר יותר.."));
  };

  if (!EventDetail) {
    return <p>Loading...</p>;
  }

  return (
    <div className='eventDetails'>
      <h2>{EventDetail.eventTopic}</h2>
      <div className='eventDetail-items'>
            <div className='eventDetails-item'>
              <h3>תיאור האירוע</h3>
              <p>{EventDetail.eventDescription}</p>
            </div>
            <div className='eventDetails-item'>
              <h3>תאריך התחלה</h3>
              <p>{EventDetail.eventStartDate}</p>
            </div>
            <div className='eventDetails-item'>
              <h3>תאריך סיום</h3>
              <p>{EventDetail.eventEndDate}</p>
            </div>

            <div className='eventDetails-item'>
            <button onClick={handleJoin}>אני רוצה להתנדב לאירוע</button>
            </div>
            
      </div>
    </div>
  );
}

export default EventDetail;
