//AssoMange.js
import React, { useState, useEffect, useContext } from 'react';
import '../css/MangePage.css';
import UserContext from '../UserContext';
import VolunteerTable_inAsso from "./VolunteerTable_inAsso";
import EventsTableForAsso from './EventsTableForAsso';

function AssoMange() {
  const [isAssoExpanded, setIsAssoExpanded] = useState(false);
  const [activeButton, setActiveButton] = useState(null);  // New state for tracking active button
  const [association, setAssociation] = useState(null);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchAssociation = async () => {
      try {
        const response = await fetch(`http://localhost:5000/associations/Profile/${currentUser.uid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch association');
        }
        const associationData = await response.json();
        setAssociation({ id: currentUser.uid, ...associationData });
      } catch (err) {
        console.error(err);
      }
    };

    if (currentUser.role === 'association') {
      fetchAssociation();
    } else {
      setAssociation(null);
    }
  }, [currentUser]);


  const handleAssoClick = (section) => {
    setActiveButton(section);  // Set active button when clicked
  }

  const renderContent = () => {
    switch (activeButton) {
      case 'registered':
        return <VolunteerTable_inAsso
          title="מתנדבים רשומים"
          initialVolunteers={association?.listMembers || []}
          isWaitingList={false}
          isListMembers={true}
          associationId={association?.id}
        />;
      case 'waiting':
        return <VolunteerTable_inAsso
          title="מתנדבים ממתינים"
          initialVolunteers={association?.WaitingListMembers || []}
          isWaitingList={true}
          isListMembers={false}
          associationId={association?.id}
        />;
      case 'events':
        return <EventsTableForAsso
          title="אירועים"
          currentuser={currentUser}
        />
      case 'home':
        return <h3>ברוך הבא לעמוד הניהול שלך!</h3>;
      default:
        return <div></div>;
    }
  }

  return (
    <div className='page'>
      <h1>עמותת {association && association.associationName}</h1>
      <div className='boxed content'>
        <div className='sidebar'>
          <div className="side-menu">
            <ul>
              <li><a onClick={() => handleAssoClick('home')}>ראשי</a></li>
              <li>
                <a className={isAssoExpanded ? 'btn-open' : 'btn-close'} onClick={() => setIsAssoExpanded(!isAssoExpanded)}>מתנדבים</a>
                {isAssoExpanded &&
                  <ul className="sub-menu-btn">
                    <li className={`sub-btn ${activeButton === 'registered' ? 'active' : ''}`}><a onClick={() => handleAssoClick('registered')}>מתנדבים רשומים</a></li>
                    <li className={`sub-btn ${activeButton === 'waiting' ? 'active' : ''}`}><a onClick={() => handleAssoClick('waiting')}>מתנדבים ממתינים</a></li>
                  </ul>
                }
              </li>
              <li className={`sub-btn ${activeButton === 'events' ? 'active' : ''}`}><a onClick={() => handleAssoClick('events')}>אירועים</a></li>
            </ul>
          </div>
        </div>
        <div className='content-area'>
          {renderContent()}
        </div>
      </div>
    </div >
  );
}

export default AssoMange;