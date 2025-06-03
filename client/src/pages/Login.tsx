import { useState, FormEvent, ChangeEvent } from "react";
import Auth from '../utils/auth'; // Utility to manage auth
import { login } from "../api/authAPI"; // API function to handle login requests

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState<string>(''); // To display error messages

  // Handle changes in form inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error message
    try {
      // Call login function from authAPI to get the JWT token
      const token = await login(loginData.username, loginData.password);
      
      // Save token using Auth utility (in localStorage or context)
      Auth.login(token);

      // Redirect user to the Kanban board or dashboard
      window.location.href = '/board'; // Or use React Router's history.push('/board') for SPAs
    } catch (err) {
      setErrorMessage('Failed to login. Please check your credentials.');
      console.error('Failed to login', err);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        
        {errorMessage && <p className="error">{errorMessage}</p>} {/* Display error message if login fails */}

        <label>Username</label>
        <input 
          type="text"
          name="username"
          value={loginData.username || ''}
          onChange={handleChange}
        />

        <label>Password</label>
        <input 
          type="password"
          name="password"
          value={loginData.password || ''}
          onChange={handleChange}
        />
        
        <button type="submit">Submit Form</button>
      </form>
    </div>
  );
};

export default Login;
