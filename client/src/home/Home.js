import React from 'react';
import '../css/Home.css';
import hero from '../assets/body.jpg';
import AssoSlide from './AssoSlide';
import EventSilde from './EventSilde';



const Home = () => {
  return (
    <div className="home-page">
      <div className="home-hero">
        <img src={hero} alt="hands" />
      </div>
      <div className="boxed">
        <div className="box-item">
          <h2 className='h2-home'>עמותות</h2>
          <AssoSlide />
        </div>
        <div className="box-item">
          <h2 className='h2-home'>אירועים</h2>
          <EventSilde />
        </div>

      </div>
    </div>
  );
};

export default Home;