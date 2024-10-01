import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`https://bloggy-97fr.onrender.com/post/${postId}/comments`);

        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error("Error fetching comments:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`https://bloggy-97fr.onrender.com/post/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text: newComment }),
      });

      if (response.ok) {
        // Assuming the response includes updated comments
        const updatedComments = await response.json();
        setComments(updatedComments); // Update comments directly
        setNewComment("");
      } else {
        console.error("Error adding comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`https://bloggy-97fr.onrender.com/post/${postId}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        // Assuming the response includes updated comments
        const updatedComments = await response.json();
        setComments(updatedComments); // Update comments directly
      } else {
        console.error("Error deleting comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      <div className="comments">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <p>
              <strong>{comment.author.username}</strong>: {comment.text}
            </p>
            {/* Render delete button only for the user who created the comment */}
            {userInfo?.username === comment.author.username && (
              <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
            )}
          </div>
        ))}
      </div>
      {/* Render add comment section only for logged-in users */}
      {userInfo ? (
        <div className="add-comment">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>
      ) : (
        <p>You must be logged in to add a comment.</p>
      )}
    </div>
  );
}
