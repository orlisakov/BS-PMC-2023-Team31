import React, { useState } from 'react';
import '../css/Form.css';
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Select from 'react-select';


function VolSignup({ onRegister }) {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerification, setPasswordVerification] = useState('');
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

    if (password !== passwordVerification) {
      alert("Passwords do not match.");
      return;
    }

    const updatedMobilePhone = fieldOfActivity.value + mobilePhone;
    console.log(updatedMobilePhone);

    try {
      const response = await fetch("http://localhost:5000/signup/volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstname, lastname, email, mobilePhone: updatedMobilePhone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Volunteer registered successfully:", data.message);
        alert("Volunteer registered successfully");
        onRegister();
      } else {
        console.log("Volunteer registration failed:", data.message);
      }
    } catch (error) {
      console.error("Error registering volunteer.", error);
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
      <form onSubmit={handleSubmit} data-testid="asso-signup-form">
        <div>
          <label className="first-name" htmlFor="VolName">שם פרטי:</label>
          <input
            className='form-input'
            placeholder="שם פרטי"
            type="text"
            id="VolName"
            name="VolName"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="last-name" htmlFor="VolLastName">שם משפחה:</label>
          <input
            className='form-input'
            placeholder="שם משפחה"
            type="text"
            id="VolLastName"
            name="VolLastName"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="phone-box">
          <span className='phone-sufix'>
            <label className="phone-label" htmlFor="phoneNumber">מספר פלאפון:</label>
            <input
              className='form-input'
              placeholder="טלפון נייד"
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={mobilePhone}
              onChange={(e) => setMobilePhone(e.target.value)}
              required
            />

          </span>
          <span className='phone-prefix'>
            <Select data-testid="fieldOfActivity"
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={passwordVerification}
            onChange={(e) => setPasswordVerification(e.target.value)}
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
export default VolSignup;
