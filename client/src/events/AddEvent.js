// addEvent.js
import React, { useState } from "react";
import '../css/EventForm.css';

function AddEvent({ associationName, onSubmit }) {
    const [eventTopic, setEventTopic] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventStartDate, setEventStartDate] = useState("");
    const [eventEndDate, setEventEndDate] = useState("");
    const [amountOfVolunteers, setAmountOfVolunteers] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/events/addEvent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ eventTopic, associationName, eventDescription, eventStartDate, eventEndDate, amountOfVolunteers }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Event registered successfully:", data.message);
                onSubmit();
            } else {
                console.log("Event registration failed:", data.message);
            }
        } catch (error) {
            console.error("Error registering Event.", error);
        }
    };

    return (
        <div className="popup-event">
            <h2>הוספת אירוע</h2>
            <form onSubmit={handleSubmit}>
                <div className="popup-event-item">
                    <label>נושא האירוע</label>
                    <input type="text" value={eventTopic} onChange={e => setEventTopic(e.target.value)} />
                </div>
                <div className="popup-event-item">
                    <label> תיאור האירוע</label>
                    <textarea value={eventDescription} onChange={e => setEventDescription(e.target.value)} />
                </div>
                <div className="popup-event-item">
                    <label>תחילת אירוע</label>
                    <input type="date" value={eventStartDate} onChange={e => setEventStartDate(e.target.value)} />
                </div>
                <div className="popup-event-item">
                    <label>סוף אירוע</label>
                    <input type="date" value={eventEndDate} onChange={e => setEventEndDate(e.target.value)} />
                </div>
                <div className="popup-event-item">
                    <label>מספר מתנדבים דרושים</label>
                    <input type="number" value={amountOfVolunteers} onChange={e => setAmountOfVolunteers(e.target.value)} />
                </div>
                <button type="submit">פרסם אירוע</button>
            </form>
        </div>
    )
}

export default AddEvent;
