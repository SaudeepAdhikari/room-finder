import React from 'react';
import Container from './components/Container';
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

export default function RoomDetailPage() {
  return (
    <Container>
      <div style={{ maxWidth: 1000, margin: '40px auto', background: 'var(--card-bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 'var(--card-padding)' }}>
        <div style={{ marginBottom: 32 }}>
          <ImageCarousel images={dummyRoom.images} style={{ borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }} />
        </div>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
          <div style={{ flex: 2, minWidth: 260 }}>
            <RoomInfo title={dummyRoom.title} price={dummyRoom.price} available={dummyRoom.available} roommatePref={dummyRoom.roommatePref} />
            <AmenitiesList amenities={dummyRoom.amenities} />
          </div>
          <div style={{ flex: 1, minWidth: 220, background: '#f8fbff', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: 18, alignSelf: 'flex-start' }}>
            <ContactHostButton />
          </div>
        </div>
        <div style={{ margin: '32px 0', background: '#f8fbff', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)' }}>
          <h3 style={{ marginBottom: 10 }}>Description</h3>
          <p style={{ fontSize: 18, lineHeight: 1.7 }}>{dummyRoom.description}</p>
        </div>
        <div style={{ margin: '32px 0', background: '#f8fbff', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)' }}>
          <ReviewsSection reviews={dummyRoom.reviews} />
        </div>
      </div>
    </Container>
  );
}
