import React from 'react';
import RoomCard from './RoomCard';

// Placeholder data
const dummyRooms = [
  {
    id: 1,
    title: 'Modern Flat',
    price: 15000,
    location: 'Kathmandu',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    type: 'Private',
    gender: 'Any',
    summary: '2BHK, furnished, balcony.',
    wifi: true,
    attachedBath: true,
    parking: true,
    furnished: true,
    verified: true,
    distance: 2.3,
  },
  {
    id: 2,
    title: 'Shared Room',
    price: 7000,
    location: 'Pokhara',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    type: 'Shared',
    gender: 'Female',
    summary: '1 room in a shared flat.',
    wifi: true,
    attachedBath: false,
    parking: false,
    furnished: false,
    verified: false,
    distance: 5.7,
  },
  {
    id: 3,
    title: 'Studio Apartment',
    price: 12000,
    location: 'Lalitpur',
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    type: 'Private',
    gender: 'Male',
    summary: 'Studio, close to city center.',
    wifi: false,
    attachedBath: true,
    parking: true,
    furnished: true,
    verified: true,
    distance: 1.1,
  },
];

function ListingsGrid({ filters, sortBy }) {
  // Filtering and sorting logic will be added later
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 24,
        padding: 'var(--space-2) 0',
        width: '100%',
        alignItems: 'stretch',
      }}
    >
      {dummyRooms.map(room => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}

export default ListingsGrid;
