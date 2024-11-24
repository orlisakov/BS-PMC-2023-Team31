import React from 'react';
import { Link } from 'react-router-dom';

function WishlistTable({ title, wishlist, handleRemoveFromWishlist }) {
    return (
        <div>
            <h2>{title}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Association Name</th>
                        <th>Recruiter Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {wishlist.map(association => (
                        <tr key={association.id}>
                            <td>{association.associationName}</td>
                            <td>{association.associationrecruiterName}</td>
                            <td>{association.associationEmail}</td>
                            <td className='td-btns'>
                                <button onClick={() => handleRemoveFromWishlist(association.id)}>הסר</button>
                                <Link to={`/ /${association.id}`}>
                                    <button>לפרופיל</button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default WishlistTable;
