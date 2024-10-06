import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const DeletePost = ({ postId, onDeleteSuccess }) => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const deletePost = async () => {
    try {
      const response = await fetch(`https://bloggy-97fr.onrender.com/post/${postId}/delete`, {
        method: 'DELETE',
        credentials: 'include', // To send cookies with the request
      });

      if (response.ok) {
        alert('Post deleted successfully');
        if (onDeleteSuccess) {
          onDeleteSuccess(); // Callback to update the UI without refreshing
        } else {
          navigate('/about'); // Use navigate to redirect to the homepage
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to delete post:', errorData);
        alert(`Failed to delete post: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  return (
    <button onClick={deletePost} className="delete-button">
      <FontAwesomeIcon icon={faTrash} /> Delete Post
    </button>
  );
};

export default DeletePost;
