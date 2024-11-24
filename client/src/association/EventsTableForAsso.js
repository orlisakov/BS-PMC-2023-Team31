//EventsTableForAsso.js
import React, { useEffect, useState } from 'react';
import Popup from '../components/Popup';
import AddEvent from '../events/AddEvent'
import EditEvent from '../events/EditEvent'

function EventsTableForAsso({ title, currentuser }) {
    const [addEventPopupOpen, setAddEventPopupOpen] = useState(false);
    const [editEventPopupOpen, setEditEventPopupOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [editEvent, setEditEvent] = useState(null);
    const [participantsPopupOpen, setParticipantsPopupOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [eventTopic, setEventTopic] = useState('');

    const fetchEvents = async () => {
        try {
            const response = await fetch("http://localhost:5000/events/getEventsforAsso", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: currentuser.associationName }),
            });
            if (!response.ok) {
                throw new Error("Failed to fetch events to this association")
            }
            const eventsData = await response.json();
            setEvents(eventsData);
            setEventTopic(eventsData.eventTopic)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDeleteEvent = async (eventToDelete) => {
        if (!window.confirm("Are you sure you want to delete this event?")) {
            return;
        }

        try {
            // Assuming you have an endpoint to delete an event and it requires the event id
            const response = await fetch(`http://localhost:5000/events/deleteEvent/${eventToDelete.id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                // Remove event from local state
                setEvents(events.filter(event => event.id !== eventToDelete.id));
            } else {
                throw new Error("Failed to delete event");
            }
        } catch (error) {
            console.error("Error deleting event", error);
        }
    };

    const handelShowAddPopup = () => {
        setAddEventPopupOpen(true);
    };

    const handelCloseAddPopup = () => {
        setAddEventPopupOpen(false);
        fetchEvents();
    };

    const handleShowEditPopup = (event) => {
        setEditEvent(event);
        setEditEventPopupOpen(true);
    };

    const handleCloseEditPopup = () => {
        setEditEventPopupOpen(false);
    };

    const handleShowParticipants = (event) => {
        setCurrentEvent(event);
        setEventTopic(event.eventTopic);
        setParticipantsPopupOpen(true);
    };

    return (
        <div>
            <div className='title-box'>
                <h2>{title}</h2>
                <button onClick={handelShowAddPopup}>הוספת אירוע  +</button>
                <Popup isOpen={addEventPopupOpen} onClose={handelCloseAddPopup}>
                    <AddEvent
                        associationName={currentuser.associationName}
                        onSubmit={handelCloseAddPopup}
                    />
                </Popup>
            </div>

            <table className='table'>
                <thead>
                    <tr>
                        <th>נושא</th>
                        <th>תאריך התחלה</th>
                        <th>תאריך סגירה</th>
                        <th>משתתפים</th>
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event, index) => (
                        <tr key={index} >
                            <td>{event.eventTopic}</td>
                            <td>{event.eventStartDate}</td>
                            <td>{event.eventEndDate}</td>
                            <td>{event.volunteers?.length}</td>
                            <td className='td-btns'>
                                <button onClick={() => handleShowParticipants(event)}>משתתפים</button>
                                <button onClick={() => handleShowEditPopup(event)}>ערוך</button>
                                <button onClick={() => handleDeleteEvent(event)}>מחק</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Popup isOpen={editEventPopupOpen} onClose={handleCloseEditPopup}>
                <EditEvent
                    initialEvent={editEvent}
                    associationName={currentuser.associationName}
                    onSubmit={handleCloseEditPopup}
                />
            </Popup>
            <Popup isOpen={participantsPopupOpen} onClose={() => setParticipantsPopupOpen(false)}>
                <div className='participants'>
                    <h2>משתתפים באירוע {eventTopic}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>שם</th>
                                <th>אימייל</th>
                                <th>פלאפון</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentEvent?.volunteers?.map((volunteer, index) => (
                                <tr key={index}>
                                    <td>{volunteer.firstName} {volunteer.lastName}</td>
                                    <td>{volunteer.email}</td>
                                    <td>{volunteer.mobilePhone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <br />
                </div>
            </Popup>
        </div>
    );
}

export default EventsTableForAsso;