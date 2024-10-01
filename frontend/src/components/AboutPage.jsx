import React from "react";

const AboutPage = () => {
  return (
    <div className="about-container">
      <h1>About Bloggy</h1>
      <p>
        <strong>Bloggy</strong> is a web application designed to empower users
        to share their thoughts, experiences, and ideas with the world. This
        platform allows authorized users to create, edit, and delete their own
        blog posts, while other users can freely read and engage with the
        content.
      </p>
      
      <h2>Features</h2>
      <ul>
        <li>User Authentication using JWT tokens for secure access</li>
        <li>Authorized users can create, edit, and delete blog posts</li>
        <li>Responsive design for seamless access on all devices</li>
        <li>Dark and Light theme switching option</li>
        <li>Real-time data fetching and updates</li>
      </ul>

      <h2>Technologies Used</h2>
      <ul>
        <li>
          <strong>Frontend:</strong> React, CSS for styling
        </li>
        <li>
          <strong>Backend:</strong> Node.js, Express
        </li>
        <li>
          <strong>Database:</strong> MongoDB
        </li>
        <li>
          <strong>Authorization:</strong> JWT (JSON Web Token)
        </li>
      </ul>

      <h2>Why Bloggy?</h2>
      <p>
        Bloggy is an ideal platform for anyone looking to express their
        creativity, share knowledge, or connect with a broader audience. Built
        with the MERN stack, Bloggy offers a secure and efficient environment
        for blogging, ensuring that users have a seamless and enjoyable
        experience.
      </p>
    </div>
  );
};

export default AboutPage;
