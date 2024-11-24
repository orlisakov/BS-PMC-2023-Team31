import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/EditAssoProfile.css'
import Select from 'react-select';
import hero from '../assets/body.jpg';



function EditAssoProfile() {
  const { id } = useParams();
  const [fieldOfActivity, setFieldOfActivity] = useState("");
  const [associationGoals, setAssociationGoals] = useState("");
  const [desiredVolunteers, setDesiredVolunteers] = useState("");
  const [volunteerRestrictions, setVolunteerRestrictions] = useState("");
  const navigate = useNavigate(); // Initialize the useNavigate hook


  const branchAreasOptions = [
    { value: "כל הארץ", label: "כל הארץ" },
    { value: "צפון", label: "צפון" },
    { value: "מרכז", label: "מרכז" },
    { value: "דרום", label: "דרום" },
    { value: "ערבה", label: "ערבה" },
  ];

  const fieldOfActivityOptions = [
    { value: "אנושית", label: "אנושית" },
    { value: "סביבה", label: "סביבה" },
    { value: "חינוך", label: "חינוך" },
    { value: "תרבות ואמנות", label: "תרבות ואמנות" },
    { value: "מעורבות חברתית", label: "מעורבות חברתית" },
    { value: "השכלה", label: "השכלה" },
    { value: "שירותי רווחה", label: "שירותי רווחה" },
    { value: "בעלי חיים", label: "בעלי חיים" },
    { value: "ספורט", label: "ספורט" },
    { value: "אחר", label: "אחר" },
  ];

  const [selectedBranchAreas, setSelectedBranchAreas] = useState([]);

  const fetchAssociationData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/associations/getProfile/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const associationData = await response.json();
        console.log("here:", associationData)
        setFieldOfActivity({ value: associationData.fieldOfActivity, label: associationData.fieldOfActivity });
        setSelectedBranchAreas(associationData.branchAreas.map(branch => ({ value: branch, label: branch })));
        setAssociationGoals(associationData.associationGoals);
        setDesiredVolunteers(associationData.desiredVolunteers);
        setVolunteerRestrictions(associationData.volunteerRestrictions);
      } else {
        console.error('An error occurred while fetching the association data.');
      }
    } catch (error) {
      console.error('An error occurred while fetching the association data:', error);
    }
  };

  useEffect(() => {
    fetchAssociationData();
  }, []);


  const handleFieldOfActivityChange = (selectedOption) => {
    setFieldOfActivity(selectedOption);
  };

  const handleBranchAreasChange = (selectedOptions) => {
    setSelectedBranchAreas(selectedOptions);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fieldOfActivity || !selectedBranchAreas || !associationGoals || !desiredVolunteers || !volunteerRestrictions) {
      alert('Please fill out all fields before submitting.');
      return;
    }

    const associationData = {
      branchAreas: selectedBranchAreas.map(option => option.value),
      fieldOfActivity: fieldOfActivity.value,
      associationGoals,
      desiredVolunteers,
      volunteerRestrictions,
    };

    try {
      const response = await fetch(`http://localhost:5000/associations/updateProfile/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(associationData),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        navigate(`/AssociationProfile/${id}`);

        // Redirect or perform some other action
      } else {
        alert('An error occurred while updating the profile.');
      }
    } catch (error) {
      console.error('An error occurred while updating the profile:', error);
    }
  };

  return (
    <div className='edit-form'>
      <div className='cover-photo'>
        <img src={hero} alt="hero" className="hero" />
      </div>

      <form onSubmit={handleSubmit} data-testid="association-registration-form">
        <div className='boxed'>
          <div className='edit-items'>
            <h1>עריכת פרופיל עמותה</h1>
            <div>
              <h3>אזורי פעילות</h3>
              <Select
                isMulti
                name="branchAreas"
                options={branchAreasOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="בחר אזורי פעילות"
                onChange={handleBranchAreasChange}
                value={selectedBranchAreas}
              />
            </div>
            <div>
              <h3>תחום פעילות</h3>
              <Select
                id="fieldOfActivity"
                name="fieldOfActivity"
                options={fieldOfActivityOptions}
                className="basic-single-select"
                classNamePrefix="select"
                placeholder="תחום פעילות"
                onChange={handleFieldOfActivityChange}
                value={fieldOfActivity}
                required
              />
            </div>
            <div>
              <h3>מטרות העמותה והאידיאולוגיה שעומדת תחתיה</h3>
              <textarea
                id="associationGoals"
                name="associationGoals"
                value={associationGoals}
                onChange={(e) => setAssociationGoals(e.target.value)}
                rows="8"
                required
              />
            </div>
            <div>
              <h3>אילו מתנדבים העמותה מחפשת לצרף</h3>
              <textarea
                id="desiredVolunteers"
                name="desiredVolunteers"
                value={desiredVolunteers}
                onChange={(e) => setDesiredVolunteers(e.target.value)}
                rows="8"
                required
              />
            </div>
            <div>
              <h3>האם ישנן מגבלות מסוימות על מתנדבים? (כמו גיל, נייד או לא וכו'..)</h3>
              <textarea
                id="volunteerRestrictions"
                name="volunteerRestrictions"
                value={volunteerRestrictions}
                onChange={(e) => setVolunteerRestrictions(e.target.value)}
                rows="8"
                required
              />
            </div>
            <div className="center">
              <button type="submit" className="small-button">שמירת שינויים</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditAssoProfile;