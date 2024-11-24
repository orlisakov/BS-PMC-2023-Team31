import React from 'react';
import '../css/About.css';

const About = () => {
  return (
    <div className="about">
      <h2>קצת עלינו</h2>
      <p>
        This site is for a project at the college in a project management course, and the site is about volunteers and associations that volunteers can volunteer on the site and associations can publish it. We are third-year students.
      </p>
      <div className="team">
        <h3>Our Team</h3>
        <ul>
          <li>Yosi</li>
          <li>Eldar</li>
          <li>Bar</li>
          <li>Orli</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
