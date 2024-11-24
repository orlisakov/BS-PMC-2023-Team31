import React, { useState, useEffect, useContext } from 'react';
import '../css/MangePage.css';
import UserContext from '../UserContext';
import AssociationTable_inVol from "./AssociationTable_inVol";
import EventsTableForVol from './EventsTableForVol';
import WishlistTable from './WhishlistTable';

function VolMange() {
  const [volunteer, setVolunteer] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const response = await fetch(`http://localhost:5000/volunteer/Profile/${currentUser.uid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch volunteer');
        }
        const volunteerData = await response.json();
        setVolunteer({ id: currentUser.uid, ...volunteerData });
      } catch (err) {
        console.error(err);
      }
    };

    if (currentUser.role === 'volunteer') {
      fetchVolunteer();
    } else {
      setVolunteer(null);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch(`http://localhost:5000/volunteer/wishlist/${currentUser.uid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist');
        }
        const wishlistData = await response.json();
        setWishlist(wishlistData);
      } catch (err) {
        console.error(err);
      }
    };

    if (currentUser.role === 'volunteer') {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [currentUser]);

  const handleRemoveFromWishlist = async (associationId) => {
    try {
      const response = await fetch(`http://localhost:5000/volunteer/removeFromWishlist/${currentUser.uid}/${associationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove association from wishlist');
      }
      // Remove the association from the local state
      setWishlist(wishlist.filter(association => association.id !== associationId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleVolClick = (section) => {
    setActiveButton(section);  // Set active button when clicked
  };

  return (
    <div className='page'>
      <h1>שלום {currentUser.firstname} {currentUser.lastname}</h1>
      <div className='boxed content'>
        <div className='sidebar'>
          <div className="side-menu">
            <ul>
              <li className={`sub-btn ${activeButton === 'home' ? 'active' : ''}`}><a>ראשי</a></li>
              <li className={`sub-btn ${activeButton === 'associations' ? 'active' : ''}`}><a onClick={() => handleVolClick('associations')}>עמותות</a></li>
              <li className={`sub-btn ${activeButton === 'events' ? 'active' : ''}`}><a onClick={() => handleVolClick('events')}>אירועים</a></li>
              <li className={`sub-btn ${activeButton === 'wishlist' ? 'active' : ''}`}><a onClick={() => handleVolClick('wishlist')}>מועדפים</a></li>
            </ul>
          </div>
        </div>
        <div className='content-area'>
          {activeButton === 'associations' && (volunteer && volunteer.listAssociations.length > 0 ? (
            <AssociationTable_inVol
              title="עמותות"
              initialAssociations={volunteer.listAssociations || []}
              volunteerId={currentUser.uid}
            />
          ) : (
            <h3>לא קיימות עמותות למשתמש זה, אתה מוזמן לעבור לדף העמותות שלנו ולהרשם לאחת העמותות.</h3>
          ))}
          {activeButton === 'events' && (volunteer && volunteer.events.length > 0 ? (
            <EventsTableForVol
              title="אירועים"
              currentuser={volunteer}
            />
          ) : (
            <h3>לא קיימים אירועים למשתמש זה, אתה מוזמן לעבור לדף האירועים שלנו ולהרשם לאחד האירועים.</h3>
          ))}
          {activeButton === 'wishlist' && (
            wishlist.length > 0 ? (
              <WishlistTable
                title="מועדפים"
                wishlist={wishlist}
                handleRemoveFromWishlist={handleRemoveFromWishlist}
              />
            ) : (
              <h3>אין עמותות ברשימת המועדפים.</h3>
            )
          )}
          {activeButton === 'home' && (
            <h3>ברוך הבא לעמוד הניהול שלך!</h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default VolMange;
