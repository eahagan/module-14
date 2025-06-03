import React, { useState, useEffect } from 'react';
import { getTickets } from '../api/ticketAPI';  // Assuming you have an API function to get tickets
import AuthService from '../utils/auth';  // Import your AuthService to handle token and authentication

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: number;
  status: string;
  // Add other fields as necessary
}

const KanbanBoard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [sorted, setSorted] = useState<boolean>(false);

  // Fetch tickets from the API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const fetchedTickets = await getTickets(); // Get tickets via API
        setTickets(fetchedTickets);
      } catch (err) {
        setError('Error fetching tickets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Function to sort tickets by priority
  const sortTickets = (tickets: Ticket[]) => {
    return tickets.sort((a, b) => a.priority - b.priority); // Sort by priority (low to high)
  };

  // Toggle sorting
  const handleSortClick = () => {
    const sortedTickets = sortTickets([...tickets]); // Create a copy of the tickets and sort
    setTickets(sortedTickets); // Update the state with the sorted tickets
    setSorted(!sorted); // Toggle sort order state
  };

  // Filter tickets by status (if needed)
  const filterTickets = (status: string) => {
    return tickets.filter((ticket) => ticket.status === status);
  };

  return (
    <div className="kanban-board">
      <h1>Kanban Board</h1>

      {/* Button to toggle sorting by priority */}
      <button onClick={handleSortClick}>
        {sorted ? 'Sort by Priority (Descending)' : 'Sort by Priority (Ascending)'}
      </button>

      {/* Display error message if there was an issue fetching tickets */}
      {error && <p className="error">{error}</p>}

      {/* Display loading state */}
      {loading ? (
        <p>Loading tickets...</p>
      ) : (
        <div className="ticket-list">
          {/* Example of displaying filtered tickets by status */}
          <div>
            <h2>To Do</h2>
            <ul>
              {filterTickets('To Do').map((ticket) => (
                <li key={ticket.id}>
                  <h3>{ticket.title}</h3>
                  <p>{ticket.description}</p>
                  <p>Priority: {ticket.priority}</p>
                  <p>Status: {ticket.status}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2>In Progress</h2>
            <ul>
              {filterTickets('In Progress').map((ticket) => (
                <li key={ticket.id}>
                  <h3>{ticket.title}</h3>
                  <p>{ticket.description}</p>
                  <p>Priority: {ticket.priority}</p>
                  <p>Status: {ticket.status}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2>Completed</h2>
            <ul>
              {filterTickets('Completed').map((ticket) => (
                <li key={ticket.id}>
                  <h3>{ticket.title}</h3>
                  <p>{ticket.description}</p>
                  <p>Priority: {ticket.priority}</p>
                  <p>Status: {ticket.status}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
