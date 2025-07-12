import React, { useState } from 'react';
import HeroSearch from './HeroSearch';
import PopularCities from './PopularCities';
import FeaturedProperties from './FeaturedProperties';
import WhyChooseUs from './WhyChooseUs';
import Testimonials from './Testimonials';
import RoomList from './RoomList';
import MultiStepForm from './components/MultiStepForm';
import { motion } from 'framer-motion';
import Container from './components/Container';
import { useAdminSettings } from './context/AdminSettingsContext';

function HomePage() {
  const { settings } = useAdminSettings();
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
        background: 'linear-gradient(120deg, #3b2175 0%, #1e3a8a 100%)', // darker, more muted
        padding: 'var(--space-16) 0 var(--space-12) 0',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Subtle dark overlay for clarity */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.18)',
          zIndex: 0,
        }} />
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
            background: 'radial-gradient(circle at 60% 40%, rgba(251,191,36,0.10) 0%, rgba(124,58,237,0.06) 100%)',
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
          opacity: 0.2,
          zIndex: 0,
        }} />
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 32px',
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              textAlign: 'center',
              color: 'var(--text-inverse)',
              marginBottom: 48,
            }}
          >
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 900,
              color: '#fff',
              textShadow: '0 4px 24px rgba(0,0,0,0.18)',
              marginBottom: 18,
              letterSpacing: '-0.03em',
              textAlign: 'center',
            }}>
              Find Your <span style={{
                background: 'linear-gradient(90deg, #f472b6 0%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 900,
              }}>Perfect</span> Room
            </h1>
            <p style={{
              fontSize: '1.35rem',
              color: '#fff',
              marginBottom: 36,
              textAlign: 'center',
              textShadow: '0 2px 8px rgba(0,0,0,0.18)',
              maxWidth: 600,
              margin: '0 auto',
            }}>
              Discover thousands of rooms and properties. Trusted by students and professionals across Nepal.
            </p>
          </motion.div>
          <div
            style={{
              background: 'rgba(255,255,255,0.10)',
              borderRadius: 24,
              boxShadow: '0 8px 32px 0 rgba(56,189,248,0.18)',
              padding: 24,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              marginTop: 18,
            }}
          >
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 16,
                padding: '16px 36px',
                fontSize: 22,
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 24px 0 rgba(56,189,248,0.18)',
                letterSpacing: 0.2,
                transition: 'background 0.18s, transform 0.18s',
                textShadow: '0 2px 8px rgba(0,0,0,0.18)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #a855f7 0%, #38bdf8 100%)';
                e.currentTarget.style.transform = 'scale(1.04)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <span role="img" aria-label="search" style={{ fontSize: 26 }}>🔍</span>
              Search Rooms
            </button>
          </div>
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
          {settings?.showPopularCities && (
            <div className="card">
              <PopularCities onCitySelect={handleCitySelect} />
            </div>
          )}

          {settings?.showFeaturedProperties && (
            <div className="card">
              <FeaturedProperties />
            </div>
          )}
        </motion.section>

        {/* Why Choose Us & Testimonials */}
        {(settings?.showWhyChooseUs || settings?.showTestimonials) && (
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
            {settings?.showWhyChooseUs && (
              <div className="card">
                <WhyChooseUs />
              </div>
            )}

            {settings?.showTestimonials && (
              <div className="card">
                <Testimonials />
              </div>
            )}
          </motion.section>
        )}

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

              {settings?.allowRoomPosting && (
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
              )}
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
              <MultiStepForm onNavigate={() => { setShowAddForm(false); setRefresh(r => !r); }} />
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
