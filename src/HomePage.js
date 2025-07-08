import React, { useState } from 'react';
import HeroSearch from './HeroSearch';
import PopularCities from './PopularCities';
import FeaturedProperties from './FeaturedProperties';
import WhyChooseUs from './WhyChooseUs';
import Testimonials from './Testimonials';
import RoomList from './RoomList';
import AddRoomForm from './AddRoomForm';
import { motion } from 'framer-motion';
import Container from './components/Container';

function HomePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleHeroSearch = ({ location, price, date }) => {
    setSearch(location);
  };

  const handleCitySelect = city => setSearch(city);

  const handleRoomAdded = () => {
    setShowAddForm(false);
    setRefresh(r => !r);
  };

  return (
    <Container>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(120deg, #7c3aed 0%, #06b6d4 100%)',
        padding: 'var(--space-16) 0 var(--space-12) 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated Gradient Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 60% 40%, rgba(251,191,36,0.12) 0%, rgba(124,58,237,0.08) 100%)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
          zIndex: 0,
        }} />
        <div style={{
          maxWidth: 'var(--container-max-width)',
          margin: '0 auto',
          padding: '0 var(--space-6)',
          position: 'relative',
          zIndex: 1,
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              textAlign: 'center',
              color: 'var(--text-inverse)',
              marginBottom: 'var(--space-12)',
            }}
          >
            <h1 style={{
              fontSize: 'var(--font-size-5xl)',
              fontWeight: 800,
              marginBottom: 'var(--space-4)',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              background: 'linear-gradient(90deg, #fff 0%, #fbbf24 40%, #a5b4fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Find Your Perfect Room
            </h1>
            <p style={{
              fontSize: 'var(--font-size-xl)',
              opacity: 0.96,
              marginBottom: 'var(--space-8)',
              maxWidth: '600px',
              margin: '0 auto var(--space-8) auto',
              lineHeight: 1.5,
              color: '#fff',
              textShadow: '0 2px 8px rgba(60,60,60,0.10)',
            }}>
              Discover thousands of rooms and properties. Trusted by students and professionals across Nepal.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            style={{ boxShadow: '0 4px 32px 0 rgba(124,58,237,0.10)', borderRadius: 'var(--radius-lg)', background: 'var(--glass)', backdropFilter: 'blur(12px)', padding: 'var(--space-4)', display: 'inline-block' }}
          >
          <HeroSearch onSearch={handleHeroSearch} />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div style={{
        maxWidth: 'var(--container-max-width)',
        margin: '0 auto',
        padding: '0 var(--space-6)',
      }}>
        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-6)',
            margin: 'var(--space-12) 0',
          }}
        >
          {[
            { number: '10,000+', label: 'Rooms Available' },
            { number: '50+', label: 'Cities Covered' },
            { number: '5,000+', label: 'Happy Renters' },
            { number: '24/7', label: 'Support Available' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="card"
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(124,58,237,0.18)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                background: 'var(--glass)',
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
                boxShadow: 'var(--shadow)',
                border: '1.5px solid rgba(124,58,237,0.10)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'box-shadow 0.3s, background 0.3s',
              }}
            >
              <div style={{
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 700,
                color: 'var(--primary)',
                marginBottom: 'var(--space-2)',
                background: 'linear-gradient(90deg, #fbbf24 0%, #7c3aed 50%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: 'var(--font-size-base)',
                color: 'var(--text-secondary)',
                fontWeight: 500,
              }}>
                {stat.label}
      </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-8)',
            margin: 'var(--space-12) 0',
          }}
        >
          <div className="card">
          <PopularCities onCitySelect={handleCitySelect} />
        </div>

          <div className="card">
          <FeaturedProperties />
        </div>
        </motion.section>

        {/* Why Choose Us & Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-8)',
            margin: 'var(--space-12) 0',
          }}
        >
          <div className="card">
          <WhyChooseUs />
        </div>

          <div className="card">
          <Testimonials />
          </div>
        </motion.section>

        {/* Room Listings Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          style={{
            background: 'none',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'none',
            border: 'none',
            margin: 'var(--space-12) 0',
            overflow: 'hidden',
          }}
        >
          <div className="card" style={{
            padding: 'var(--space-8)',
            borderBottom: '1px solid var(--gray-200)',
            background: 'var(--surface-elevated)',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            boxShadow: 'none',
            marginBottom: 0,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
            }}>
              <h2 style={{
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
              }}>
                Available Rooms
              </h2>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddForm(!showAddForm)}
                style={{
                  background: 'var(--primary-gradient)',
                  color: 'var(--text-inverse)',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  padding: 'var(--space-3) var(--space-6)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition)',
                }}
              >
                {showAddForm ? 'Cancel' : 'Add Your Room'}
              </motion.button>
        </div>
      </div>

        {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="card"
              style={{
                padding: 'var(--space-8)',
                borderBottom: '1px solid var(--gray-200)',
                background: 'var(--surface-hover)',
                borderRadius: 0,
                boxShadow: 'none',
                marginBottom: 0,
              }}
            >
            <AddRoomForm onRoomAdded={handleRoomAdded} />
            </motion.div>
          )}

          <div className="card" style={{ padding: 'var(--space-8)', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', boxShadow: 'none', marginTop: 0 }}>
            <RoomList key={refresh} search={search} category={category} />
          </div>
        </motion.section>
    </div>
    </Container>
  );
}

export default HomePage;
