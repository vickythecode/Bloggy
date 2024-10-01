import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);

  // Function to trim and validate input
  const validateInput = (input) => {
    return input.trim() !== '' && input.length >= 4;
  };

  async function register(ev) {
    ev.preventDefault();

    // Validate username and password
    if (!validateInput(username)) {
      alert('Username must be at least 4 characters long and should not contain only spaces.');
      return;
    }
    if (password.trim() === '') {
      alert('Password cannot be empty.');
      return;
    }

    // Send data to the server if validation passes
    try {
      const response = await fetch('https://bloggy-97fr.onrender.com/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        setRedirect(true);
        alert('Registration successful');
      } else {
        alert('Registration failed or User Aldready Exist');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration.');
    }
  }

  if (redirect) {
    return <Navigate to={'/login'} />
  }

  return (
    <div className="registerContainer">
      <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={ev => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={ev => setPassword(ev.target.value)}
      />
      <button>Register</button>
    </form>
    </div>
    
  );
}
 