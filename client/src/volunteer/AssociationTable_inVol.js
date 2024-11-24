//AssociationList.js
import React, { useState, useEffect } from 'react';

function AssociationList({ title, initialAssociations, volunteerId }) {
    const [associations, setAssociations] = useState([]);

    useEffect(() => {
        setAssociations(initialAssociations);
    }, [initialAssociations]);

    const handleDelete = async (associationId) => {
        try {
            const response = await fetch(`http://localhost:5000/volunteers/deleteAssociations/${volunteerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ associationId: associationId }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete association');
            }

            // Remove the association from the local state
            setAssociations(associations.filter(association => association.uid !== associationId));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>{title}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Recruiter Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {associations && associations.map(association => (
                        <tr key={association.uid}>
                            <td>{association.associationName}</td>
                            <td>{association.associationrecruiterName}</td>
                            <td>{association.associationEmail}</td>
                            <td>{association.recruiterMobilePhone}</td>
                            <td className='td-btns'>
                                <button onClick={() => handleDelete(association.uid)}>מחק</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AssociationList;
