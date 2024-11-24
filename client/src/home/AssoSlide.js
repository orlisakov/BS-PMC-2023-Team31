import React, { useState, useEffect } from "react";
import { db } from '../config/firebaseClient';
import { collection, query, where, getDocs } from "firebase/firestore";
import Slider from "../components/Slider";
import Cards from "../components/Cards";


const AssoSlide = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const usersCollection = collection(db, "Associations");
      const associationsQuery = query(usersCollection, where("role", "==", "association"));
      const associationsSnapshot = await getDocs(associationsQuery);
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
            <Cards data={card} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AssoSlide;
