//AssociationProfile.js

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import Comments from '../components/Comments';
import Cards from '../components/Cards';
import hero from '../assets/body.jpg';
import whishlist from '../assets/wishlist.svg';
import whishlist_added from '../assets/wishlist added.svg';
import "../css/AssociationProfile.css"


function AssociationProfile() {
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);
  const [associationName, setAssociationName] = useState(null);
  const [association, setAssociation] = useState(null);
  const [cards, setCards] = useState([]);
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistClicked, setWishlistClicked] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, [currentUser]);

  useEffect(() => {
    fetchAssociation();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/events/getEventsforAsso", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: associationName }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events for this association");
        }

        const eventsData = await response.json();
        setCards(eventsData);
      } catch (error) {
        console.log(error);
      }
    };

    if (associationName) {
      fetchEvents();
    }
  }, [associationName]);

  useEffect(() => {
    if (association && currentUser?.role === "volunteer") {
      const isMember = association.listMembers.some(member => member.uid === currentUser.uid);
      const isWaiting = association.WaitingListMembers.some(member => member.uid === currentUser.uid);

      if (isMember) {
        setMembershipStatus('member');
      } else if (isWaiting) {
        setMembershipStatus('waiting');
      } else {
        setMembershipStatus('none');
      }
    } else if (association && currentUser?.role === "association") {
      setMembershipStatus('owner');
    }
  }, [association, currentUser]);

  useEffect(() => {
    if (wishlist && association) {
      setWishlistClicked(wishlist.some(a => a.id === association.id));
    }
  }, [wishlist, association]);

  const fetchAssociation = async () => {
    try {
      const response = await fetch(`http://localhost:5000/associations/Profile/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch association');
      }

      const associationData = await response.json();
      setAssociation({ id, ...associationData });
      setAssociationName(associationData.associationName);
      if (currentUser.role === 'volunteer') {
        setIsWaiting(
          currentUser.role === 'volunteer' &&
          associationData.WaitingListMembers.some(member => member.uid === currentUser.uid)
        );
      }

    } catch (err) {
      console.error(err);
    }
  };

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

  const handleJoinClick = async () => {
    try {
      const response = await fetch(`http://localhost:5000/associations/join/${association.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: currentUser.uid,
          firstname: currentUser.firstname,
          lastname: currentUser.lastname,
          mobilePhone: currentUser.mobilePhone,
          email: currentUser.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to join association');
      }

      setIsWaiting(true);
      fetchAssociation();
      alert('הבקשה נשלחה בהצלחה! ניצור איתך קשר בהקדם');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelWait = async () => {
    try {
      const response = await fetch(`http://localhost:5000/associations/rejectVolunteer/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ volunteerId: currentUser.uid }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel wait');
      }

      setIsWaiting(false);
      fetchAssociation();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSettingsButton = () => {
    navigate(`/AssoMange/${currentUser.uid}`);
  };

  const handleEditButton = () => {
    navigate(`/EditAssoProfile/${currentUser.uid}`);
  };

  const handleWishlistClick = async () => {
    const isInWishlist = wishlist.some(a => a.id === association.id);
    const endpoint = isInWishlist
      ? `http://localhost:5000/volunteer/removeFromWishlist/${currentUser.uid}/${id}`
      : `http://localhost:5000/volunteer/addToWishlist/${currentUser.uid}/${id}`;
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

      fetchWishlist();
      fetchAssociation();
    } catch (err) {
      console.error(err);
    }
  };

  const renderJoinButton = () => {
    if (!currentUser || !currentUser.role) {
      return null; // Return null if currentUser or role is not available
    }

    switch (membershipStatus) {
      case 'member':
        return (
          <div className='edit-btn'>
            <button className="btn" disabled>כבר רשום</button>
          </div>
        );
      case 'waiting':
        return (
          <div className='edit-btn'>
            <button className="btn" onClick={handleCancelWait}>ביטול המתנה</button>
          </div>
        );
      case 'owner':
        return (
          <div className='edit-btn'>
            <button className="btn" onClick={handleSettingsButton}>הגדרות</button>
            <button className="btn" onClick={handleEditButton}>עריכה</button>
          </div>
        );
      default:
        return (
          <div className='edit-btn'>
            {currentUser.role === 'volunteer' && (
              <>
                <button onClick={handleWishlistClick} className="wishlist-button tooltip">
                  <img src={wishlistClicked ? whishlist_added : whishlist} className="wishlist-icon" />
                  {wishlistClicked ? (
                    <span className="tooltiptext">הסרה מהמועדפים</span>
                  ) : (
                    <span className="tooltiptext">הוספה למועדפים</span>
                  )}
                </button>
                <button className="btn" onClick={handleJoinClick}>הצטרפות לעמותה</button>
              </>
            )}
          </div>
        );
    }
  };


  return (
    <div className='profile'>
      {association ? (
        <>
          <div className="cover-photo">
            <img src={hero} alt="hands" />
          </div>
          <div className='boxed'>
            <div className="group-info">
              <h1 className="group-title">{association.associationName}</h1>
              {renderJoinButton()}
              <div className="info">
                <div className="info-item">
                  <h3>נציג העמותה</h3>
                  <p>{association.associationrecruiterName}</p>
                </div>
                <div className="info-item">
                  <h3>כתובת מייל</h3>
                  <p>{association.associationEmail}</p>
                </div>
                <div className="info-item">
                  <h3>טלפון</h3>
                  <p>{association.recruiterMobilePhone}</p>
                </div>
              </div>
              <div className="profile">
                <div className="profile-item">
                  <h4>מטרות העמותה</h4>
                  <p>{association.profile.associationGoals}</p>
                </div>
                <div className="profile-item">
                  <h4>המתנדבים שאנחנו מחפשים</h4>
                  <p>{association.profile.desiredVolunteers}</p>
                </div>
              </div>
            </div>
            <div className="events-box">
              <h2>אירועי העמותה</h2>
              <div className='events'>
                {cards.map((card) => <Cards key={card.id} data={card} type="events" />)}
              </div>
            </div>
            <div className="comment">
              <h2>תגובות</h2>
              <Comments associationId={association.id} currentUser={currentUser} />
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default AssociationProfile;
