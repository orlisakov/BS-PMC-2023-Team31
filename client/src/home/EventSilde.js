import React, { useState, useEffect } from "react";
import { db } from '../config/firebaseClient';
import { collection, getDocs } from "firebase/firestore";
import Slider from "../components/Slider";
import Cards from "../components/Cards";

const EventSilde = () => {
  const [cards, setCards] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      const usersCollection = collection(db, "Events");
      const associationsSnapshot = await getDocs(usersCollection);
      const associations = associationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCards(associations);
    };
    fetchData();
  }, []);

  return (
    <div>
      <Slider>
        {cards.map((card, index) => (
          <div key={index} className="card-container">
            <Cards data={card} type={"events"} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default EventSilde;
