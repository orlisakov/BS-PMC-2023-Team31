import React, { useState, useEffect } from 'react';
import '../css/searchPages.css';
import Cards from '../components/Cards';
import { db } from '../config/firebaseClient';
import { collection, getDocs, query, where, arrayContains } from "firebase/firestore";

const Associations = () => {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [area, setArea] = useState("");

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const associationsCollection = collection(db, "Associations");
      let associationsSnapshot;

      if (type && area) {
        const q = query(
          associationsCollection,
          where("profile.fieldOfActivity", "==", type),
          where("profile.branchAreas", "array-contains", area)
        );
        associationsSnapshot = await getDocs(q);
      } else if (type) {
        const q = query(associationsCollection, where("profile.fieldOfActivity", "==", type));
        associationsSnapshot = await getDocs(q);
      } else if (area) {
        const q = query(associationsCollection, where("profile.branchAreas", "array-contains", area));
        associationsSnapshot = await getDocs(q);
      } else {
        associationsSnapshot = await getDocs(associationsCollection);
      }

      const associations = associationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Fetched associations:', associations); // Log the fetched associations
      setCards(associations);
    };
    fetchData();
  }, [type, area]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredCards = search
    ? cards.filter((card) => {
      if (card.associationName) {
        return card.associationName.toLowerCase().includes(search.toLowerCase());
      }
      return false;
    })
    : cards;

  return (
    <div className='boxed filterPage'>
      <h1>עמותות</h1>
      <div className="filter-section">
        <div className="filter-item">
          <input
            type="text"
            placeholder="חיפוש עמותה..."
            value={search}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="filter-item">
          <select onChange={(e) => setType(e.target.value)}>
            <option value="">בחר סוג</option>
            <option value="אנושית">אנושית</option>
            <option value="סביבה">סביבה</option>
            <option value="חינוך">חינוך</option>
            <option value="תרבות ואמנות">תרבות ואמנות</option>
            <option value="מעורבות חברתית">מעורבות חברתית</option>
            <option value="השכלה">השכלה</option>
            <option value="שירותי רווחה">שירותי רווחה</option>
            <option value="בעלי חיים">בעלי חיים</option>
          </select>
        </div>
        <div className="filter-item">
          <select onChange={(e) => setArea(e.target.value)}>
            <option value="">בחר אזור</option>
            <option value="כל הארץ">כל הארץ</option>
            <option value="צפון">צפון</option>
            <option value="מרכז">מרכז</option>
            <option value="דרום">דרום</option>
            <option value="ערבה">ערבה</option>
          </select>
        </div>
      </div>
      <div className="cards-section">
        {filteredCards.map((card) => <Cards key={card.id} data={card} type="association" />)}
      </div>
    </div>
  );
};

export default Associations;
