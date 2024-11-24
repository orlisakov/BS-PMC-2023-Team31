import React, { useState, useEffect } from 'react';
import '../css/MangePage.css';

function Dashboard() {
  const [selectedType, setSelectedType] = useState('');
  const [volunteers, setVolunteers] = useState([]);
  const [associations, setAssociations] = useState([]);
  const [events, setEvents] = useState([]);
  const [adminMessages, setAdminMessages] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/getUsersData');
        if (response && !response.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData = await response.json();
        console.log("here!!", usersData.adminMessages)
        setVolunteers(usersData.volunteers);
        setAssociations(usersData.associations);
        setEvents(usersData.events);
        setAdminMessages(usersData.adminMessages);  // Set the admin messages

      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/getRecentUsers');
        if (response && !response.ok) {
          throw new Error('Failed to fetch recent users');
        }
        const recentUsersData = await response.json();
        setRecentUsers({
          volunteers: recentUsersData.volunteers,
          associations: recentUsersData.associations,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecentUsers();
  }, []);

  const handleButtonClick = (type) => {
    setSelectedType(type);
  };

  const renderUserList = () => {
    if (selectedType === 'associations') {
      return (
        <div>
          <h2>עמותות</h2>
          <table>
            <thead>
              <tr>
                <th>שם העמותה</th>
                <th>שם הנציג</th>
                <th>דוא"ל העמותה</th>
                <th>טלפון הנציג</th>
              </tr>
            </thead>
            <tbody>
              {associations.map((user) => (
                <tr key={user.id}>
                  <td>{user.associationName}</td>
                  <td>{user.associationrecruiterName}</td>
                  <td>{user.associationEmail}</td>
                  <td>{user.recruiterMobilePhone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (selectedType === 'volunteers') {
      return (
        <div>
          <h2>מתנדבים</h2>
          <table>
            <thead>
              <tr>
                <th>שם פרטי</th>
                <th>שם משפחה</th>
                <th>דוא"ל</th>
                <th>טלפון נייד</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((user) => (
                <tr key={user.id}>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.mobilePhone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (selectedType === 'home') {
      return (
        <div>
          <h2>מתנדבים שנרשמו לאחרונה</h2>
          <table>
            <thead>
              <tr>
                <th>שם פרטי</th>
                <th>שם משפחה</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers && recentUsers.volunteers && recentUsers.volunteers.map((user) => (
                <tr key={user.id}>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <br />
          <h2>עמותות שנרשמו לאחרונה</h2>
          <table>
            <thead>
              <tr>
                <th>שם העמותה</th>
                <th>שם הנציג</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers && recentUsers.associations && recentUsers.associations.map((user) => (
                <tr key={user.id}>
                  <td>{user.associationName}</td>
                  <td>{user.associationrecruiterName}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      );
    }

    if (selectedType === "events") {
      return (
        <div>
          <h2>אירועים</h2>
          <table>
            <thead>
              <tr>
                <th>נושא</th>
                <th>שם עמותה</th>
                <th>תאריך התחלה</th>
                <th>תאריך סגירה</th>
              </tr>
            </thead>
            <tbody>
              {events.map((user) => (
                <tr key={user.id}>
                  <td>{user.eventTopic}</td>
                  <td>{user.associationName}</td>
                  <td>{user.eventStartDate}</td>
                  <td>{user.eventEndDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    }

    if (selectedType === "inbox") {
      return (
        <div>
          <h2>הודעות מנהל</h2>
          <table>
            <thead>
              <tr>
                <th>שם המשתמש</th>
                <th>ההודעה</th>
                <th>תאריך</th>
              </tr>
            </thead>
            <tbody>
              {adminMessages.map((msg, index) => (
                <tr key={index}>
                  <td>{msg.senderName}</td>
                  <td>{msg.message}</td>
                  <td>{msg.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    return null;
  };

  return (
    <div className='page'>
      <h1>דף ניהול האתר</h1>
      <div className='boxed content'>
        <div className='sidebar'>
          <div className="side-menu">
            <ul>
              <li className={`sub-btn ${selectedType === 'home' ? 'active' : ''}`}><a onClick={() => handleButtonClick('home')}>ראשי</a></li>
              <li className={`sub-btn ${selectedType === 'associations' ? 'active' : ''}`}><a onClick={() => handleButtonClick('associations')}>עמותות</a></li>
              <li className={`sub-btn ${selectedType === 'volunteers' ? 'active' : ''}`}><a onClick={() => handleButtonClick('volunteers')}>מתנדבים</a></li>
              <li className={`sub-btn ${selectedType === 'events' ? 'active' : ''}`}><a onClick={() => handleButtonClick('events')}>אירועים</a></li>
              <li className={`sub-btn ${selectedType === 'inbox' ? 'active' : ''}`}><a onClick={() => handleButtonClick('inbox')}>הודעות</a></li>
            </ul>
          </div>
        </div>
        <div className='content-area'>
          {renderUserList()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;