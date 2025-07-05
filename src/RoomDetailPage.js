import React from 'react';
import ImageCarousel from './ImageCarousel';
import RoomInfo from './RoomInfo';
import AmenitiesList from './AmenitiesList';
import ContactHostButton from './ContactHostButton';
import ReviewsSection from './ReviewsSection';

// Placeholder room data
const dummyRoom = {
  title: 'Modern Flat in Kathmandu',
  images: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
  ],
  price: 15000,
  available: true,
  roommatePref: 'Female, Private',
  amenities: ['Wifi', 'Laundry', 'Furnished', 'Parking'],
  description: 'A beautiful flat with all modern amenities, close to city center. Ideal for students or working professionals.',
  reviews: [
    { user: 'Sujan', rating: 5, text: 'Amazing place, great location!' },
    { user: 'Priya', rating: 4, text: 'Very comfortable and well maintained.' },
  ],
};

function RoomDetailPage() {
  return (
    <div style={{maxWidth:1000,margin:'32px auto',background:'#fff',borderRadius:16,boxShadow:'0 2px 16px #1976d222',padding:32}}>
      <ImageCarousel images={dummyRoom.images} />
      <RoomInfo title={dummyRoom.title} price={dummyRoom.price} available={dummyRoom.available} roommatePref={dummyRoom.roommatePref} />
      <AmenitiesList amenities={dummyRoom.amenities} />
      <div style={{margin:'24px 0'}}>
        <ContactHostButton />
      </div>
      <div style={{margin:'24px 0'}}>
        <h3>Description</h3>
        <p>{dummyRoom.description}</p>
      </div>
      <ReviewsSection reviews={dummyRoom.reviews} />
    </div>
  );
}

export default RoomDetailPage;
