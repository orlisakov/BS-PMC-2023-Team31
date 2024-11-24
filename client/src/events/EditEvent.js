// EditEvent.js
import React, { useState, useEffect } from "react";
import '../css/EventForm.css';

function EditEvent({ initialEvent, associationName, onSubmit }) {
    const [eventTopic, setEventTopic] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventStartDate, setEventStartDate] = useState("");
    const [eventEndDate, setEventEndDate] = useState("");
    const [amountOfVolunteers, setAmountOfVolunteers] = useState("");

    useEffect(() => {
        if (initialEvent) {
            setEventTopic(initialEvent.eventTopic || "");
            setEventDescription(initialEvent.eventDescription || "");
            setEventStartDate(initialEvent.eventStartDate || "");
            setEventEndDate(initialEvent.eventEndDate || "");
            setAmountOfVolunteers(initialEvent.amountOfVolunteers || "");
        }
    }, [initialEvent]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/events/editEvent", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: initialEvent.id,
                    eventTopic,
                    associationName,
                    eventDescription,
                    eventStartDate,
                    eventEndDate,
                    amountOfVolunteers,
                }),
            });

            if (response.ok) {
                onSubmit();
            } else {
                throw new Error("Failed to update event");
            }
        } catch (error) {
            console.error("Error updating event", error);
        }
    };


    return (
        <div className="popup-event">
            <h2>עריכת אירוע {eventTopic}</h2>
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
                <button type="submit">עדכן אירוע</button>
            </form>
        </div>
    )
}

export default EditEvent;
