import React, { useRef, useState, useEffect } from "react";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

export default function Post({ _id, title, summary, cover, content, createdAt, author }) {
  const loadingBar = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [postDetails, setPostDetails] = useState({ likes: [], comments: [] });

  useEffect(() => {
    // Fetch post details to get the total likes and comments
    fetch(`http://localhost:4000/post/${_id}`)
      .then(response => response.json())
      .then(data => setPostDetails({ likes: data.likes, comments: data.comments }))
      .catch(error => console.error("Error fetching post details:", error));

    // Simulate loading bar
    if (isLoading) {
      loadingBar.current.continuousStart();
    }
    const timer = setTimeout(() => {
      setIsLoading(false);
      loadingBar.current.complete();
    }, 1000); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, [_id, isLoading]);

  return (
    <>
      <LoadingBar color="#f11946" ref={loadingBar} />
      {!isLoading && (
        <div className="post">
          <div className="image">
            <Link to={`/post/${_id}`}>
              <img src={'http://localhost:4000/' + cover} alt="" />
            </Link>
          </div>
          <div className="texts">
            <Link to={`/post/${_id}`}>
              <h2>{title}</h2>
            </Link>
            <Link to={`/post/${_id}`}>
              <p className="info">
                <span className="author">{author.username}</span>
                <time>{formatISO9075(new Date(createdAt))}</time>
              </p>
              <p className="summary">{summary}</p>
            </Link>
            {/* Display the total likes and comments */}
            <div className="post-meta">
              <span>{postDetails.likes.length} Likes</span> | <span>{postDetails.comments.length} Comments</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
