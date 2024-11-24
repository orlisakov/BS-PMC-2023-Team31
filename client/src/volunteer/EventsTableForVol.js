//EventTable.js
import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../UserContext';



function EventsTableForVol({ title, currentuser }) {
    const [events, setEvents] = useState([]);
    const { currentUser } = useContext(UserContext);


    useEffect(() => {
        if (currentuser && currentuser.events) {
            setEvents(currentuser.events);
        }
    }, [currentuser])

    const deleteEvent = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/volunteers/deleteEvent/${currentUser.uid}/${eventId}`, {
                method: 'DELETE',
            });
            console.log("respond: ", response)
            if (!response.ok) {
                throw new Error('Failed to delete event');
            }
            // Update the local state after deletion
            setEvents(events.filter(event => event.id !== eventId));
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h2>{title}</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>נושא</th>
                        <th>תאריך התחלה</th>
                        <th>תאריך סגירה</th>
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {events && events.map((event) => (
                        <tr key={currentuser.events.id}>
                            <td>{event.topic}</td>
                            <td>{event.startDate}</td>
                            <td>{event.endDate}</td>
                            <td className='td-btns'>
                                <button onClick={() => deleteEvent(event.id)}>מחק</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EventsTableForVol;
