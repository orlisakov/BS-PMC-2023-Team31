// VolunteerProfile.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import hero from '../assets/body.jpg';


function VolunteerProfile() {
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);
  const [volunteer, setVolunteer] = useState(null);
  const navigate = useNavigate();

  const fetchVolunteer = async () => {
    try {
      const response = await fetch(`http://localhost:5000/volunteer/Profile/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch volunteer');
      }
      const volunteerData = await response.json();
      setVolunteer({ id, ...volunteerData });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVolunteer();
  }, [id]);

  const handleSettingsButton = () => {
    navigate(`/VolMange/${currentUser.uid}`);
  };

  const handleEditButton = () => {
    navigate(`/EditVolProfile/${currentUser.uid}`);
  };

  return (
    <div>
      {volunteer ? (
        <>
          <div className="cover-photo">
            <img src={hero} alt="hands" />
          </div>
          <div className='boxed'>
            <div className='group-info'>
              <h1>{volunteer.firstname} {volunteer.lastname}</h1>
              {currentUser && currentUser.uid === id && (
                <div className='edit-btn'>
                  <button className='btn' onClick={handleSettingsButton}>הגדרות</button>
                  <button className='btn' onClick={handleEditButton}>עריכה</button>
                </div>
              )}
              <div className='info'>
                <div className='info-item'>
                  <h3>כתובת מייל</h3>
                  <p>{volunteer.email}</p>
                </div>
                <div className='info-item'>
                  <h3>טלפון נייד</h3>
                  <p>{volunteer.mobilePhone}</p>
                </div>
                <div className='info-item'>
                  <h3>גיל</h3>
                  <p>{volunteer.profile.age}</p>
                </div>
                <div className='info-item'>
                  <h3>אזור מגורים</h3>
                  <p>{volunteer.profile.livingArea}</p>
                </div>
              </div>
              <div className='profile'>
                <div className='profile-item'>
                  <h3>האם נייד</h3>
                  <p>{volunteer.profile.isMobile ? 'כן' : 'לא'}</p>
                </div>
                <div className='profile-item'>
                  <h3>מה המטרות שלי</h3>
                  <p>{volunteer.profile.interests}</p>
                </div>
                <div className='profile-item'>
                  <h3>מה אני יכול להציע</h3>
                  <p>{volunteer.profile.skills}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default VolunteerProfile;
