import { useContext, useEffect, useState } from "react";
import { useParams, Link, Navigate ,useNavigate} from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../context/UserContext";
import DeletePost from "./DeletePost";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate(); 

  useEffect(() => {
    // Fetch the post details
    fetch(`https://bloggy-97fr.onrender.com/post/${id}`)
      .then(response => response.json())
      .then(postInfo => {
        setPostInfo(postInfo);
        setLikes(postInfo.likes);
        setComments(postInfo.comments);
      });
  }, [id]);

  const handleDeleteSuccess = () => {
    <Navigate to={'/'} /> // Redirect to the homepage after successful deletion
  };

  const handleLike = async () => {
    if (!userInfo.id) { // Check if the user is not logged in
      navigate('/login'); // Redirect to login page
      return;
    }

    const response = await fetch(`https://bloggy-97fr.onrender.com/post/${id}/like`, {
      method: 'POST',
      credentials: 'include',
    });
    const updatedPost = await response.json();
    setLikes(updatedPost.likes);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (!userInfo.id) { // Check if the user is not logged in
      navigate('/login'); // Redirect to login page
      return;
    }

    const commentText = event.target.comment.value;

    const response = await fetch(`https://bloggy-97fr.onrender.com/post/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ text: commentText }),
    });

    const updatedPost = await response.json();
    setComments(updatedPost.comments);
    event.target.reset(); // Clear the input
  };

  const handleCommentDelete = async (commentId) => {
    const response = await fetch(`https://bloggy-97fr.onrender.com/post/${id}/comments/${commentId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      // Filter out the deleted comment from the comments state
      setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
    }
  };

  if (!postInfo) return '';

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>

      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Edit this post
          </Link>
        </div>
      )}

      <div className="image">
        <img src={`https://bloggy-97fr.onrender.com/${postInfo.cover}`} alt="" />
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
      
      {/* Likes Section */}
      <div className="likes-section">
        <button onClick={handleLike}>
          {likes.includes(userInfo.id) ? "Unlike" : "Like"}
        </button>
        <p>{likes.length} likes</p>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h2>Comments ({comments.length})</h2>
        <form onSubmit={handleCommentSubmit}>
          <textarea name="comment" placeholder="Add a comment..." required></textarea>
          <button type="submit">Submit</button>
        </form>
        <div className="comments">
          {comments.map(comment => (
            <div key={comment._id} className="comment">
              <strong>{comment.user.username}</strong>: <p className="cmtTxt">{comment.text}</p>
              {comment.user === userInfo.id && (
                <button onClick={() => handleCommentDelete(comment._id)}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {userInfo.id === postInfo.author._id && (
        <DeletePost postId={postInfo._id} onDeleteSuccess={handleDeleteSuccess} />
      )}
    </div>
  );
}
