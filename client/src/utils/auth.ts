import jwtDecode, { JwtPayload } from 'jwt-decode'; // Import the jwt-decode library

class AuthService {
  // Get the decoded profile (from the JWT token)
  getProfile() {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Decode the JWT token to get user profile data
      const decoded: JwtPayload = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  // Check if the user is logged in (token exists and is not expired)
  loggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if the token is expired
    return !this.isTokenExpired(token);
  }
  
  // Check if the token has expired
  isTokenExpired(token: string): boolean {
    try {
      const decoded: JwtPayload = jwtDecode(token);
      const exp = decoded.exp as number; // Get the expiration time from the decoded token
      return Date.now() >= exp * 1000; // Check if the current time is greater than the expiration time
    } catch (error) {
      console.error('Error checking token expiration', error);
      return true;
    }
  }

  // Get the token from localStorage
  getToken(): string | null {
    return localStorage.getItem('auth_token'); // Return the token if it exists, otherwise return null
  }

  // Save the token to localStorage
  login(idToken: string) {
    localStorage.setItem('auth_token', idToken); // Store the JWT token in localStorage
    // Optionally, redirect to the home page or dashboard
    window.location.href = '/board'; // Redirect to the Kanban board or other protected page
  }

  // Remove the token from localStorage (log the user out)
  logout() {
    localStorage.removeItem('auth_token'); // Remove the token from localStorage
    // Redirect to the login page after logout
    window.location.href = '/login'; // Redirect to the login page
  }
}

export default new AuthService();

