import axios from 'axios';

// Your server URL (update this if needed)
const API_URL = 'http://localhost:5000'; 

// Login function to authenticate user and get JWT token
export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    
    // Save the token to localStorage
    const token = response.data.token;
    localStorage.setItem('auth_token', token); // Store the JWT token

    return token; // Return the JWT token
  } catch (error) {
    console.error('Login failed', error);
    throw new Error('Invalid credentials');
  }
};

// Function to retrieve the JWT token from localStorage
export const getToken = () => {
  return localStorage.getItem('auth_token');
};

// Axios instance for making authenticated requests
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add the token to the Authorization header for all requests
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Function to fetch protected resources (example)
export const getTickets = async () => {
  try {
    const response = await axiosInstance.get('/api/tickets');
    return response.data; // Return the list of tickets
  } catch (error) {
    console.error('Error fetching tickets', error);
    throw new Error('Unable to fetch tickets');
  }
};

// You can create other API methods for interacting with protected routes as needed
export const createTicket = async (ticketData: any) => {
  try {
    const response = await axiosInstance.post('/api/tickets', ticketData);
    return response.data; // Return the created ticket
  } catch (error) {
    console.error('Error creating ticket', error);
    throw new Error('Unable to create ticket');
  }
};

