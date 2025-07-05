// API utility for Room Finder frontend
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function fetchRooms(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/rooms?${query}`);
  if (!res.ok) throw new Error('Failed to fetch rooms');
  return res.json();
}

export async function addRoom(room) {
  const res = await fetch(`${API_BASE}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(room),
  });
  if (!res.ok) throw new Error('Failed to add room');
  return res.json();
}
