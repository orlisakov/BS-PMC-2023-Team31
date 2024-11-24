import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/EditAssoProfile.css'


function EditVolProfile() {
  const { id } = useParams();
  const [age, setAge] = useState("");
  const [livingArea, setLivingArea] = useState("");
  const [isMobile, setIsMobile] = useState("");
  const [volunteeredBefore, setVolunteeredBefore] = useState("");
  const [interests, setInterests] = useState("");
  const [skills, setSkills] = useState("");
  const [workedInOrg, setWorkedInOrg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVolunteerData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/volunteer/getProfile/${id}`);
        const volunteerData = await response.json();
        if (response.ok) {
          setAge(volunteerData.profile.age);
          setLivingArea(volunteerData.profile.livingArea);
          setIsMobile(volunteerData.profile.isMobile);
          setVolunteeredBefore(volunteerData.profile.volunteeredBefore);
          setInterests(volunteerData.profile.interests);
          setSkills(volunteerData.profile.skills);
          setWorkedInOrg(volunteerData.profile.workedInOrg);
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching volunteer data:', error);
      }
    };

    fetchVolunteerData();
  }, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const profileData = {
      age,
      livingArea,
      isMobile,
      volunteeredBefore,
      interests,
      skills,
      workedInOrg,
    };

    try {
      const response = await fetch(`http://localhost:5000/volunteer/updateProfile/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        navigate(`/VolunteerProfile/${id}`);
      } else {
        alert('An error occurred while updating the profile.');
      }
    } catch (error) {
      console.error('An error occurred while updating the profile:', error);
    }
  };

  return (
    <div className='edit-form'>
      <h2>עריכת פרופיל</h2>
      <form onSubmit={handleSubmit} data-testid="vol-edit-form">
        <div className='boxed'>
          <div className='edit-items'>
            <div>
              <h3>גיל</h3>
              <input
                className='form-input'
                placeholder="גיל"
                type="number"
                id="age"
                name="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div>
              <h3>אזור מגורים</h3>
              <input
                className='form-input'
                placeholder="אזור מגורים"
                type="text"
                id="livingArea"
                name="livingArea"
                value={livingArea}
                onChange={(e) => setLivingArea(e.target.value)}
              />
            </div>
            <div>
              <h3>האם את/ה נייד/ת (יש לך רכב לשימוש):</h3>
              <input
                className='form-input'
                placeholder="האם את/ה נייד/ת? כלומר האם עומד רכב לשימושך?"
                type="text"
                id="isMobile"
                name="isMobile"
                value={isMobile}
                onChange={(e) => setIsMobile(e.target.value)}
              />
            </div>
            <div>
              <h3>האם התנדבת בעבר</h3>
              <input
                className='form-input'
                placeholder="האם התנדבת בעבר? אם כן, פרט היכן ומתי"
                type="text"
                id="volunteeredBefore"
                name="volunteeredBefore"
                value={volunteeredBefore}
                onChange={(e) => setVolunteeredBefore(e.target.value)}
              />
            </div>
            <div>
              <h3>תחומי עניין</h3>
              <textarea
                placeholder="מהם תחומי העניין שלך? באילו תחומים היית מעוניין להתנדב?"
                id="interests"
                name="interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </div>
            <div>
              <h3>כישורים או מיומנויות שיכולות להפוך אותך למתנדב/ת ראוי/ה</h3>
              <textarea
                placeholder="פרט/י על כישורים או מיומנויות שעושים אותך מתנדב/ת ראוי/ה"
                id="skills"
                name="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
            <div>
              <h3>האם עבדת בארגון התנדבותי בעבר</h3>
              <input
                className='form-input'
                placeholder="האם עבדת בארגון התנדבותי בעבר?"
                type="text"
                id="workedInOrg"
                name="workedInOrg"
                value={workedInOrg}
                onChange={(e) => setWorkedInOrg(e.target.value)}
              />
            </div>
            <div className="center">
              <button type="submit">שמור</button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}

export default EditVolProfile;
