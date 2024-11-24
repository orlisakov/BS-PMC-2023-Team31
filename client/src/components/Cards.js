import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../css/Cards.css';
import EventDetail from '../events/EventDetail';
import Popup from '../components/Popup';
import hero from '../assets/body.jpg';
import whishlist from '../assets/wishlist.svg';
import whishlist_added from '../assets/wishlist added.svg';
import UserContext from '../UserContext';

const Cards = ({ data, type }) => {
  const { id } = data;
  const [showPopup, setShowPopup] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistClicked, setWishlistClicked] = useState(false);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (currentUser && currentUser.role === 'volunteer') {
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
      }
    };
    fetchWishlist();
  }, [currentUser]);

  useEffect(() => {
    if (wishlist && data) {
      setWishlistClicked(wishlist.some(a => a.id === data.id));
    }
  }, [wishlist, data]);

  const handleClickDetails = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleWishlistClick = async () => {
    if (currentUser) {
      if (currentUser.role !== 'volunteer') {
        alert('You must register as a volunteer to add this to your wishlist.');
      } else {
        const isInWishlist = wishlist.some(a => a.id === data.id);
        const endpoint = isInWishlist
          ? `http://localhost:5000/volunteer/removeFromWishlist/${currentUser.uid}/${data.id}`
          : `http://localhost:5000/volunteer/addToWishlist/${currentUser.uid}/${data.id}`;
        const method = isInWishlist ? 'DELETE' : 'POST';

        try {
          const response = await fetch(endpoint, {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(isInWishlist ? 'Failed to remove association from wishlist' : 'Failed to add association to wishlist');
          }

          const updatedWishlistResponse = await fetch(`http://localhost:5000/volunteer/wishlist/${currentUser.uid}`);
          if (!updatedWishlistResponse.ok) {
            throw new Error('Failed to fetch updated wishlist');
          }

          const updatedWishlist = await updatedWishlistResponse.json();
          setWishlist(updatedWishlist);
        } catch (err) {
          alert(err.message);  // Show error message in an alert
          console.error(err);
        }
      }
    } else {
      alert('Please log in to add this to your wishlist.');
    }
  };


  return (
    <div className="card">
      <div className="card-img">
        <img src={hero} alt="hands" />
      </div>
      <div className="card-content">
        {type === "events" ? (
          <span>
            <h3>{data.eventTopic}</h3>
            <p className='event-assname'><b>עמותה:</b>  {data.associationName}</p>
            <p className='event-description'>{data.eventDescription}</p>
          </span>
        ) : (
          <span>
            <h3>{data.associationName}</h3>
            <p className='description'>{data.profile.associationGoals}</p>
          </span>
        )}
        {type === "events" ? (
          <div className="btns">
            <Link to={`/events/profile/${id}`}>
              <button className='post-link' onClick={handleClickDetails}>לפרטים</button>
            </Link>
          </div>
        ) : (
          <div className={currentUser && currentUser.role === 'volunteer' ? "loop-btns" : "btns"}>
            {currentUser && currentUser.role === 'volunteer' && (
              <button className="wishlist-button-loop tooltip" onClick={handleWishlistClick}>
                <img src={wishlistClicked ? whishlist_added : whishlist} className="wishlist-icon" />
                {wishlistClicked ? (
                  <span className="tooltiptext">הסרה מהמועדפים</span>
                ) : (
                  <span className="tooltiptext">הוספה למועדפים</span>
                )}
              </button>
            )}
            <Link to={`/associationProfile/${id}`}>
              <button className='post-link'>לפרטים</button>
            </Link>
          </div>
        )}
      </div>
      {showPopup && (
        <Popup isOpen={showPopup} onClose={handleClosePopup}>
          <EventDetail eventId={id} onClose={handleClosePopup} />
        </Popup>
      )}
    </div>
  );
};

export default Cards;
