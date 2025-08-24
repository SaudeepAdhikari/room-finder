import React from 'react';
import ImageCarousel from './ImageCarousel';
import RoomInfo from './RoomInfo';
import AmenitiesList from './AmenitiesList';
import ReviewsSection from './ReviewsSection';
import ContactHostButton from './ContactHostButton';

const RoomDetailPage = () => (
  <main className="container room-detail-layout" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
    <ImageCarousel />
    <RoomInfo />
    <AmenitiesList />
    <ReviewsSection />
    <ContactHostButton />
  </main>
);

export default RoomDetailPage;
