import React, { useState, useEffect } from 'react';
import Cards from '../components/Cards';
import { db } from '../config/firebaseClient';
import { collection, getDocs, query, where } from "firebase/firestore";

const Events = () => {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [area, setArea] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let associationsCollection = collection(db, "Associations");

      let associationsQuery = associationsCollection;

      if (type) {
        associationsQuery = query(associationsQuery, where("profile.fieldOfActivity", "==", type));
      }

      if (area) {
        associationsQuery = query(associationsQuery, where("profile.branchAreas", "array-contains", area));
      }

      const associationsSnapshot = await getDocs(associationsQuery);
      const associations = associationsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const eventsCollection = collection(db, "Events");
      const eventsAndAssociations = await Promise.all(
        associations.map(async (association) => {
          const eventsSnapshot = await getDocs(
            query(eventsCollection, where("associationName", "==", association.associationName))
          );
          return eventsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            association,
          }));
        })
      );

      setCards(eventsAndAssociations.flat());
    };

    fetchData();
  }, [type, area, search]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredCards = cards.filter((card) =>
    search ? card.eventName?.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className='boxed filterPage'>
      <h1>אירועים</h1>
      <div className="filter-section">
        <div className="filter-item">
          <input
            type="text"
            placeholder="חיפוש אירוע..."
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
        {filteredCards.map((card) => <Cards key={card.id} data={card} type="events" />)}
      </div>
    </div>
  );
};

export default Events;
