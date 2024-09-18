import Post from "./Post";
import {useEffect, useState} from "react";

export default function IndexPage() {
  const [posts,setPosts] = useState([]);
  useEffect(() => {
    fetch('http://localhost:4000/post').then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <>
      <div className="post-container">
      {posts.length > 0 && posts.map(post => (
        <Post {...post} key={post._id}/>
      ))}
      </div>
     
    </>
  );
}
 