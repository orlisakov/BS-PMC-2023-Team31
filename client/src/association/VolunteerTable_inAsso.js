// VolunteerList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/tables.css'

function VolunteerList({ title, initialVolunteers, isWaitingList, isListMembers, associationId }) {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    setVolunteers(initialVolunteers);
  }, [initialVolunteers, isWaitingList, isListMembers]);

  const handleApprove = async (volunteerId) => {
    try {
      const response = await fetch(`http://localhost:5000/associations/approveVolunteer/${associationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ volunteerId: volunteerId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to approve volunteer:', errorData); // improved error logging
        throw new Error('Failed to approve volunteer');
      }
      const responseData = await response.json();
      console.log('Approve volunteer response:', responseData); // added logging
      alert('Volunteer approved successfully');

      // Update the volunteers list in the state based on the server response
      setVolunteers(responseData.WaitingListMembers);
    } catch (error) {
      console.error('Error approving volunteer:', error);
    }
  };

  const handleReject = async (volunteerId) => {
    try {
      const response = await fetch(`http://localhost:5000/associations/rejectVolunteer/${associationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ volunteerId: volunteerId }),
      });
      if (!response.ok) {
        throw new Error('Failed to reject volunteer');
      }
      alert('Volunteer rejected successfully');

      // Remove the volunteer from the waiting list in the state
      setVolunteers(volunteers.filter(vol => vol.uid !== volunteerId));
    } catch (error) {
      console.error('Error rejecting volunteer:', error);
    }
  };

  const handleDelete = async (volunteerId) => {
    try {
      const response = await fetch(`http://localhost:5000/associations/deleteVolunteer/${associationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ volunteerId: volunteerId }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        console.error('Failed to delete volunteer:', responseData); // improved error logging
        throw new Error('Failed to delete volunteer');
      }

      alert('Volunteer deleted successfully');

      // Remove the volunteer from the listMembers in the state
      setVolunteers(volunteers.filter(vol => vol.uid !== volunteerId));
    } catch (error) {
      console.error('Error deleting volunteer:', error);
    }
  };


  return (
    <div>
      <div className='title-box'>
        <h2>{title}</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>שם</th>
            <th>אימייל</th>
            <th>פלאפון</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {volunteers && volunteers.map(volunteer => (
            <tr key={volunteer.uid}>
              <td>{volunteer.firstname} {volunteer.lastname}</td>
              <td>{volunteer.email}</td>
              <td>{volunteer.mobilePhone}</td>
              {isWaitingList && (
                <td className='td-btns'>
                  <button onClick={() => handleApprove(volunteer.uid)}>אשר</button>
                  <button onClick={() => handleReject(volunteer.uid)}>דחה</button>
                  <Link to={`/VolunteerProfile/${volunteer.uid}`}>
                    <button>לפרופיל</button>
                  </Link>
                </td>
              )}
              {isListMembers && (
                <td className='td-btns'>
                  <button onClick={() => handleDelete(volunteer.uid)}>מחק</button>
                </td>
              )}

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VolunteerList;
