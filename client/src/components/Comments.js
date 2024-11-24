import React, { useState, useEffect } from 'react';
import "../css/Comments.css"
import userIcon from '../assets/user-profile-icon.png';


function Comments({ associationId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/associations/comments/${associationId}`);

      const responseBodyAsText = await response.text();
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      if (responseBodyAsText) {
        const commentsData = JSON.parse(responseBodyAsText);
        setComments(commentsData);
      } else {
        console.log('No comments found for this association');
        setComments([]);
      }
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    fetchComments();
  }, []);

  const handleCommentChange = (event) => {
    if (!currentUser)
      alert("עלייך להיות מחובר, על מנת להגיב לפרופיל זה")
    else
      setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    let CommentData;
    if (currentUser) {
      if (currentUser.role === 'association') {
        CommentData = {
          senderName: currentUser.associationName,
          comment: newComment,
        };
      } else if (currentUser.role === 'volunteer') {
        CommentData = {
          senderName: `${currentUser.firstname} ${currentUser.lastname}`,
          comment: newComment,
        };
      }
    } else {
      CommentData = {
        senderName: '',
        comment: newComment,
      };
    }

    try {
      const response = await fetch(`http://localhost:5000/associations/addComment/${associationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(CommentData),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      fetchComments();
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="comments">
      {comments.map((comment, index) => (
        <div className="comment-item" key={index}>
          <img src={userIcon} alt="icon"></img>
          <div className='comment-content'>
            <h3>{comment.Name}</h3>
            <p>{comment.comment}</p>
          </div>
        </div>
      ))}

      <div className='comment-form'>
        <form onSubmit={handleCommentSubmit}>
          <h3>כתוב תגובה</h3>
          <textarea rows="8" value={newComment} onChange={handleCommentChange} placeholder="התגובה שלך" required />
          <button type="submit">פרסם תגובה</button>
        </form>`
      </div>
    </div>
  );
}

export default Comments;