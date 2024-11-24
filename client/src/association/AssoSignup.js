import React, { useState } from 'react';
import '../css/Form.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Select from 'react-select';


function AssoSignup({ onRegister }) {
  const [associationName, setassociationName] = useState('');
  const [associationrecruiterName, setassociationrecruiterName] = useState('');
  const [joinDate, setJoinDate] = useState(new Date());
  const [recruiterMobilePhone, setPhoneNumber] = useState('');
  const [associationEmail, setassociationEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [dateErrorMessage, setDateErrorMessage] = useState('');
  const [dateError, setDateError] = useState(false);
  const [phoneNumberPrefix, setPhoneNumberPrefix] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordAgainVisible, setPasswordAgainVisible] = useState(false);
  const [fieldOfActivity, setFieldOfActivity] = useState("");


  const fieldOfActivityOptions = [
    { value: "050", label: "050" },
    { value: "052", label: "052" },
    { value: "053", label: "053" },
    { value: "054", label: "054" },
  ];

  const handleFieldOfActivityChange = (selectedOption) => {
    setFieldOfActivity(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isAssociationValid = false;

    const updatedMobilePhone = fieldOfActivity.value + recruiterMobilePhone;

    try {
      const response = await fetch('http://localhost:5000/associationsData');
      const associationsData = await response.json();
      const normalizeAssociationName = (str) =>
        str.replace(/\s+/g, ' ').replace(/(\(ע~ר\)|\(קא~ה\))/g, '').trim();

      const trimmedAssociationName = associationName.trim();
      let trimmedRegistrationDate = '';

      if (joinDate) {
        const date = new Date(joinDate);
        trimmedRegistrationDate = date.toLocaleDateString('en-GB').replace(/\//g, '/');
      } else {
        setDateError(true);
        setDateErrorMessage('תאריך הצטרפות לאיגוד הוא שדה חובה.');
        alert('!הרישום נכשל, שם העמותה או תאריך הרישום אינם תקפים.');
        return;
      }

      isAssociationValid = Array.isArray(associationsData) && associationsData.some((record) => {
        const recordAssociationName = normalizeAssociationName(record['שם עמותה בעברית'].trim());
        const recordRegistrationDate = record['תאריך רישום עמותה'].trim();
        return (
          recordAssociationName === normalizeAssociationName(trimmedAssociationName) &&
          recordRegistrationDate === trimmedRegistrationDate
        );
      });
    } catch (error) {
      console.error('Error fetching associations data:', error);

    }

    if (isAssociationValid) {
      try {
        const response = await fetch("http://localhost:5000/signup/association", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ associationName, associationrecruiterName, associationEmail, recruiterMobilePhone: updatedMobilePhone, password }),
        });

        const data = await response.json();

        if (response.ok) {
          onRegister();
          console.log("Association registered successfully:", data.message);
          alert('רישום העמותה בוצע בהצלחה!');
        } else {
          console.log("Association registration failed:", data.message);
          alert('..רישום העמותה נכשל! נסה שנית');
        }
      } catch (error) {
        console.error("Error registering association.", error);
        alert('רישום העמותה נכשל יש לנסות שנית מאוחר יותר');
      }
    } else {
      setDateError(true);
      alert('!הרישום נכשל, שם העמותה או תאריך הרישום אינם תקפים.');
    }
  };

  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }

  function togglePasswordAgainVisibility() {
    setPasswordAgainVisible(!passwordAgainVisible);
  }

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>

        <div>
          <label className="company-name" htmlFor="associationName">שם עמותה:</label>
          <input
            className='form-input'
            placeholder="שם העמותה"
            type="text"
            id="associationName"
            name="associationName"
            value={associationName}
            onChange={(e) => setassociationName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="first-name" htmlFor="associationrecruiterName">נציג עמותה:</label>
          <input
            className='form-input'
            placeholder="שם נציג העמותה"
            type="text"
            id="associationrecruiterName"
            name="associationrecruiterName"
            value={associationrecruiterName}
            onChange={(e) => setassociationrecruiterName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="date-label" htmlFor="joinDate">
            תאריך הצטרפות לאיגוד:
          </label>
          <DatePicker
            className={`date-picker${dateErrorMessage ? ' error' : ''} form-input`}
            locale="he"
            id="joinDate"
            data-testid="joinDate"
            name="joinDate"
            selected={joinDate}
            onChange={(date) => {
              setJoinDate(date);
              setDateErrorMessage('');
            }}
            placeholderText="תאריך הצטרפות לאיגוד"
            dateFormat="dd/MM/yyyy"
          />
          {dateErrorMessage && (
            <p className="error-message">{dateErrorMessage}</p>
          )}
        </div>
        <div className="phone-box">
          <span className='phone-sufix'>
            <label className="phone-label" htmlFor="phoneNumber">מספר פלאפון:</label>
            <input
              className='form-input'
              placeholder="טלפון נייד"
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={recruiterMobilePhone}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </span>
          <span className='phone-prefix'>
            <Select
              id="fieldOfActivity"
              name="fieldOfActivity"
              options={fieldOfActivityOptions}
              className="basic-single-select"
              classNamePrefix="select"
              placeholder="קידומת"
              onChange={handleFieldOfActivityChange}
              value={fieldOfActivity}
              required
            />
          </span>
        </div>
        <div>
          <label className="email-label" htmlFor="email">.</label>
          <input className="form-input"
            placeholder="אימייל"
            type="email"
            id="email"
            name="email"
            value={associationEmail}
            onChange={(e) => setassociationEmail(e.target.value)}
            required
          />
        </div>
        <div className="password-div">
          <label className="password-label" htmlFor="password">סיסמא:</label>
          <input
            className='form-input'
            placeholder="בחר סיסמה"
            type={passwordVisible ? "text" : "password"} // Change this line
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-visibility-toggle"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? <BsEyeSlashFill /> : <BsEyeFill />}
          </button>
        </div>
        <div className="password-div">
          <label className="password-label" htmlFor="passwordConfirmation">סיסמא חוזרת:</label>
          <input
            className='form-input'
            placeholder="הקלד שוב סיסמה"
            type={passwordAgainVisible ? "text" : "password"} // And this line
            id="passwordConfirmation"
            name="passwordConfirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-visibility-toggle"
            onClick={togglePasswordAgainVisibility}
          >
            {passwordAgainVisible ? <BsEyeSlashFill /> : <BsEyeFill />}
          </button>
        </div>
        <button className='form-btn' type="submit">הרשמה</button>
      </form>
    </div>
  );
}

export default AssoSignup;
