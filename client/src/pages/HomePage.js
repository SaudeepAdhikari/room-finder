import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useViewportScroll, useTransform, useMotionValue } from 'framer-motion';
import '../styles/pages/home.css';
import { FaSearch, FaUserFriends, FaCheckCircle, FaMapMarkedAlt, FaLocationArrow } from 'react-icons/fa';
import { fetchRooms } from '../api';

// Preload critical images
const preloadImages = () => {
  const imageUrls = [
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'
  ];

  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Floating animated background shapes with parallax
function FloatingShapesParallax() {
  const { scrollY } = useViewportScroll();
  // Parallax for each shape
  const parallaxY = [
    useTransform(scrollY, [0, 600], [0, -40]),
    useTransform(scrollY, [0, 600], [0, 30]),
    useTransform(scrollY, [0, 600], [0, -20]),
    useTransform(scrollY, [0, 600], [0, 25]),
    useTransform(scrollY, [0, 600], [0, -35]),
  ];
  const shapes = [
    { top: '10%', left: '8%', size: 80, color: 'rgba(124,58,237,0.13)' },
    { top: '60%', left: '12%', size: 120, color: 'rgba(59,189,248,0.11)' },
    { top: '30%', left: '80%', size: 100, color: 'rgba(6,182,212,0.10)' },
    { top: '75%', left: '70%', size: 60, color: 'rgba(168,85,247,0.13)' },
    { top: '45%', left: '50%', size: 140, color: 'rgba(59,130,246,0.09)' },
  ];
  return (
    <div style={{ position: 'fixed', zIndex: 0, inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          initial={{ y: 0 }}
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 4 + i * 1, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: s.top, left: s.left,
            width: s.size, height: s.size,
            background: s.color,
            borderRadius: '50%',
            filter: 'blur(2px)',
            y: parallaxY[i],
          }}
        />
      ))}
    </div>
  );
}

// Animated icon wrapper
function AnimatedIcon({ children, type = 'bounce', delay = 0 }) {
  let animateProps = {};
  if (type === 'bounce') {
    animateProps = {
      animate: { y: [0, -10, 0] },
      transition: { duration: 1, repeat: Infinity, repeatType: 'loop', delay },
    };
  } else if (type === 'spin') {
    animateProps = {
      animate: { rotate: [0, 360] },
      transition: { duration: 1.5, repeat: Infinity, ease: 'linear', delay },
    };
  } else if (type === 'pulse') {
    animateProps = {
      animate: { scale: [1, 1.15, 1] },
      transition: { duration: 0.8, repeat: Infinity, repeatType: 'loop', delay },
    };
  }
  return <motion.span style={{ display: 'inline-block' }} {...animateProps}>{children}</motion.span>;
}

const featuredRooms = [
  {
    img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80',
    title: 'Cozy Flat in Kathmandu',
    location: 'Kathmandu',
    price: 'Rs. 12,000/mo',
  },
  {
    img: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80',
    title: 'Modern Hostel Room',
    location: 'Pokhara',
    price: 'Rs. 6,500/mo',
  },
  {
    img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    title: 'Bright Apartment',
    location: 'Patan',
    price: 'Rs. 18,000/mo',
  },
];

const testimonials = [
  {
    name: 'Aarav S.',
    text: 'Found my dream room in Kathmandu within days. Super easy and trustworthy!',
    avatar: '🧑🏻',
  },
  {
    name: 'Priya T.',
    text: 'Listing my flat was simple and I got great tenants fast. Love SajiloStay!',
    avatar: '👩🏽',
  },
  {
    name: 'Ramesh K.',
    text: 'The best way to find hostels and apartments in Nepal. Highly recommended!',
    avatar: '👨🏾',
  },
];

const popularCities = [
  { name: 'Kathmandu', img: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80', rooms: 120 },
  { name: 'Pokhara', img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', rooms: 80 },
  { name: 'Lalitpur', img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80', rooms: 60 },
  { name: 'Butwal', img: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&q=80', rooms: 40 },
  { name: 'Dharan', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', rooms: 30 },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};
const cardVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: i => ({
    opacity: 1, scale: 1,
    transition: { delay: i * 0.05, duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  })
};

export default function HomePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [liveFeatured, setLiveFeatured] = useState(null);
  const [featuredLoading, setFeaturedLoading] = useState(false);

  // Preload images on component mount
  React.useEffect(() => {
    preloadImages();
  }, []);

  // Fetch live featured rooms (approved, unbooked) - up to 4
  React.useEffect(() => {
    let mounted = true;
    async function loadFeatured() {
      setFeaturedLoading(true);
      try {
        const rooms = await fetchRooms({ limit: 4, includeBooked: false });
        if (!mounted) return;
        // Normalize rooms into same shape expected by UI
        const normalized = (rooms || []).slice(0, 4).map(r => ({
          id: r._id || r.id,
          img: (r.images && r.images.length > 0) ? r.images[0] : (r.imageUrl || ''),
          title: r.title || r.name || 'Untitled',
          location: (r.location && r.location.city) ? r.location.city : (r.location || ''),
          price: r.price ? `Rs. ${r.price}` : (r.priceText || ''),
          raw: r,
        }));
        setLiveFeatured(normalized);
      } catch (e) {
        console.warn('Failed to load featured rooms', e);
        setLiveFeatured([]);
      } finally {
        setFeaturedLoading(false);
      }
    }
    loadFeatured();
    return () => { mounted = false; };
  }, []);

  // Mouse-based parallax for hero
  const heroRef = useRef();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const heroTitleX = useTransform(mouseX, [0, 1], [-10, 10]);
  const heroTitleY = useTransform(mouseY, [0, 1], [-8, 8]);
  const searchBarX = useTransform(mouseX, [0, 1], [-6, 6]);
  const searchBarY = useTransform(mouseY, [0, 1], [-4, 4]);
  const handleHeroMouseMove = e => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };
  const handleHeroMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleNewsletter = e => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
    setEmail('');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/listings');
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };



  const [isLocating, setIsLocating] = useState(false);

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setIsLocating(false);
        navigate(`/listings?lat=${latitude}&lon=${longitude}`);
      },
      (error) => {
        console.error("Error fetching location:", error);
        setIsLocating(false);
        alert("Unable to retrieve your location. Please allow location access.");
      },
      { timeout: 10000, maximumAge: 60000 } // Add options for faster/cached result if available
    );
  };

  const { scrollY } = useViewportScroll();

  // Parallax for featured/city images (fix: hooks at top level)
  // Individual parallax transforms for cities
  const city1Parallax = useTransform(scrollY, [0, 600], [0, 18]);
  const city2Parallax = useTransform(scrollY, [0, 600], [0, -22]);
  const city3Parallax = useTransform(scrollY, [0, 600], [0, 26]);
  const city4Parallax = useTransform(scrollY, [0, 600], [0, -30]);
  const city5Parallax = useTransform(scrollY, [0, 600], [0, 34]);
  const city6Parallax = useTransform(scrollY, [0, 600], [0, -38]);

  // Individual parallax transforms for featured rooms
  const room1Parallax = useTransform(scrollY, [0, 600], [0, 28]);
  const room2Parallax = useTransform(scrollY, [0, 600], [0, -32]);
  const room3Parallax = useTransform(scrollY, [0, 600], [0, 36]);
  const room4Parallax = useTransform(scrollY, [0, 600], [0, -40]);
  const room5Parallax = useTransform(scrollY, [0, 600], [0, 44]);
  const room6Parallax = useTransform(scrollY, [0, 600], [0, -48]);

  // Arrays for easy access
  const cityParallaxY = [city1Parallax, city2Parallax, city3Parallax, city4Parallax, city5Parallax, city6Parallax];
  const featuredParallaxY = [room1Parallax, room2Parallax, room3Parallax, room4Parallax, room5Parallax, room6Parallax];

  return (
    <div className="wc-home-bg" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Animated Gradient Background */}
      <div className="animated-gradient-bg" />
      <FloatingShapesParallax />
      {/* Hero Section */}
      <motion.section
        className="wc-hero"
        initial="visible"
        variants={sectionVariants}
        style={{ position: 'relative', zIndex: 2 }}
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        <div className="wc-hero-content">
          <motion.h1
            className="wc-hero-title"
            initial={{ opacity: 1, y: 0 }}
            style={{ x: heroTitleX, y: heroTitleY }}
          >
            Find Your Perfect Room in Nepal
          </motion.h1>
          <motion.p
            className="wc-hero-sub"
            initial={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            style={{ x: heroTitleX, y: heroTitleY }}
          >
            Nepal's trusted platform for hostels, apartments, and more. Fast, safe, and local.
          </motion.p>
          {/* Visually enhanced tagline */}
          <motion.p
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              background: 'linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
              marginTop: 18,
              marginBottom: 0,
              letterSpacing: 0.5,
              textShadow: '0 2px 16px #a78bfa44',
              filter: 'drop-shadow(0 2px 8px #a78bfa22)',
              x: heroTitleX,
              y: heroTitleY,
            }}
            initial={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Experience the Future — One Click at a Time.
          </motion.p>
          {/* Glowing Search Bar */}
          <div style={{ margin: '2.5rem auto 0', maxWidth: 480, position: 'relative', zIndex: 2 }}>
            <motion.div
              initial={{ boxShadow: '0 0 0 0 #7c3aed44' }}
              animate={{ boxShadow: '0 0 32px 8px #7c3aed44' }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              style={{ borderRadius: 16, x: searchBarX, y: searchBarY }}
            >
              <div className="wc-search-bar" style={{ boxShadow: '0 4px 32px #7c3aed22, 0 0 0 4px #7c3aed11' }}>
                <FaSearch style={{ color: '#7c3aed', fontSize: 22, marginRight: 8 }} />
                <input
                  type="text"
                  placeholder="Search city, area, or property..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  style={{ flex: 1, fontSize: 18, border: 'none', outline: 'none', background: 'transparent' }}
                />
                <button
                  className="wc-search-btn"
                  onClick={handleSearch}
                  style={{ fontSize: 18, padding: '0.7rem 2.2rem', borderRadius: 10, fontWeight: 800 }}
                >
                  Search
                </button>
              </div>
            </motion.div>
          </div>

          {/* Search Near Me Button */}
          <motion.div
            style={{ margin: '1rem auto 0', textAlign: 'center', position: 'relative', zIndex: 2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={handleNearMe}
              disabled={isLocating}
              style={{
                background: isLocating ? '#94a3b8' : 'linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%)',
                color: '#fff',
                padding: '0.8rem 1.5rem',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: 700,
                border: 'none',
                cursor: isLocating ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: isLocating ? 'none' : '0 4px 15px rgba(124, 58, 237, 0.3)',
                transition: 'all 0.3s ease',
                opacity: isLocating ? 0.8 : 1
              }}
              onMouseOver={(e) => {
                if (!isLocating) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLocating) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.3)';
                }
              }}
            >
              <FaLocationArrow className={isLocating ? "fa-spin" : ""} />
              {isLocating ? "Locating..." : "Search Near Me"}
            </button>
          </motion.div>
        </div>
      </motion.section >
      {/* Wavy SVG Divider */}
      <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0, position: 'relative', zIndex: 1 }}>
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 80, display: 'block' }}>
          <path fill="#ede9fe" d="M0,40 C360,120 1080,0 1440,80 L1440,0 L0,0 Z" />
        </svg>
      </div >

      {/* About/Mission Section */}
      < motion.section className="wc-about" initial="hidden" animate="visible" variants={sectionVariants} >
        <div className="wc-about-inner">
          <h2 className="wc-section-title">Why SajiloStay?</h2>
          <p className="wc-about-text">SajiloStay connects you with the best rooms and hosts in Nepal. Our mission: make finding a home easy, transparent, and enjoyable for everyone.</p>
        </div>
      </motion.section >

      {/* Popular Cities Section */}
      < motion.section className="wc-cities" initial="hidden" animate="visible" variants={sectionVariants} >
        <h2 className="wc-section-title">Popular Cities</h2>
        <div className="wc-cities-grid">
          {popularCities.map((city, i) => (
            <motion.div className="wc-city-card" key={i} custom={i} initial="hidden" animate="visible" variants={cardVariants} whileHover={{ scale: 1.06, boxShadow: '0 8px 32px #7c3aed22' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
              <motion.img
                src={city.img}
                alt={`Rooms in ${city.name}`}
                style={{ y: cityParallaxY[i] }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: i * 0.1 }}
                loading="eager"
              />
              <div className="wc-city-info">
                <div className="wc-city-name"><AnimatedIcon type="bounce" delay={i * 0.2}><FaMapMarkedAlt /></AnimatedIcon> {city.name}</div>
                <div className="wc-city-rooms">{city.rooms}+ rooms</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section >

      {/* Featured/Explore Section */}
      < motion.section className="wc-featured" initial="hidden" animate="visible" variants={sectionVariants} >
        <h2 className="wc-section-title">Featured Rooms</h2>
        <div className="wc-featured-grid">
          {(liveFeatured && liveFeatured.length > 0 ? liveFeatured : featuredRooms).map((room, i) => (
            <motion.div className="wc-featured-card" key={room.id || i} custom={i} initial="hidden" animate="visible" variants={cardVariants} whileHover={{ scale: 1.06, boxShadow: '0 8px 32px #38bdf822' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
              <div style={{ width: '100%', height: 180, overflow: 'hidden', background: '#e0e7ef' }}>
                <motion.img
                  src={room.img}
                  alt={room.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', y: featuredParallaxY[i] }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.1 }}
                  loading="eager"
                />
              </div>
              <div style={{ height: 1, background: 'linear-gradient(90deg, #ede9fe 0%, #c7d2fe 100%)', margin: '0 0 0 0' }} />
              <div className="wc-featured-info" style={{ textAlign: 'left', background: 'rgba(124,58,237,0.06)', borderRadius: '0 0 18px 18px', padding: '1.3rem 1.2rem 1.3rem 1.2rem', marginTop: 0 }}>
                <div className="wc-featured-title" style={{ marginBottom: 8 }}>{room.title}</div>
                <div className="wc-featured-meta" style={{ color: '#64748b', fontSize: 16 }}>{room.location} &middot; <span style={{ color: '#7c3aed', fontWeight: 700 }}>{room.price}</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section >

      {/* How It Works Section */}
      < motion.section className="wc-how" initial="hidden" animate="visible" variants={sectionVariants} >
        <h2 className="wc-section-title">How It Works</h2>
        <div className="wc-how-steps">
          <motion.div className="wc-how-step" initial="hidden" animate="visible" variants={cardVariants} custom={0} whileHover={{ scale: 1.07, boxShadow: '0 8px 32px #7c3aed22' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <AnimatedIcon type="spin"><FaSearch className="wc-how-icon" /></AnimatedIcon><div>Search</div><p>Browse rooms, hostels, and apartments in your city.</p></motion.div>
          <motion.div className="wc-how-step" initial="hidden" animate="visible" variants={cardVariants} custom={1} whileHover={{ scale: 1.07, boxShadow: '0 8px 32px #38bdf822' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <AnimatedIcon type="pulse"><FaCheckCircle className="wc-how-icon" /></AnimatedIcon><div>Book</div><p>Contact hosts and book your perfect stay securely.</p></motion.div>
          <motion.div className="wc-how-step" initial="hidden" animate="visible" variants={cardVariants} custom={2} whileHover={{ scale: 1.07, boxShadow: '0 8px 32px #06b6d422' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <AnimatedIcon type="bounce"><FaUserFriends className="wc-how-icon" /></AnimatedIcon><div>Move In</div><p>Enjoy your new space and community in Nepal.</p></motion.div>
        </div>
      </motion.section >

      {/* Lifestyle/Community Section */}
      < motion.section className="wc-lifestyle" initial="hidden" animate="visible" variants={sectionVariants} >
        <h2 className="wc-section-title">More Than Just Rooms</h2>
        <div className="wc-lifestyle-grid">
          <motion.div className="wc-lifestyle-card" initial="hidden" animate="visible" variants={cardVariants} custom={0} whileHover={{ scale: 1.07, boxShadow: '0 8px 32px #7c3aed22' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <AnimatedIcon type="pulse"><FaCheckCircle className="wc-lifestyle-icon" /></AnimatedIcon>
            <div className="wc-lifestyle-title">Verified Listings</div>
            <div className="wc-lifestyle-text">Every room and host is checked for your peace of mind.</div>
          </motion.div>
          <motion.div className="wc-lifestyle-card" initial="hidden" animate="visible" variants={cardVariants} custom={1} whileHover={{ scale: 1.07, boxShadow: '0 8px 32px #38bdf822' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <AnimatedIcon type="bounce"><FaUserFriends className="wc-lifestyle-icon" /></AnimatedIcon>
            <div className="wc-lifestyle-title">Local Support</div>
            <div className="wc-lifestyle-text">Our Nepal-based team is here for you.</div>
          </motion.div>
          <motion.div className="wc-lifestyle-card" initial="hidden" animate="visible" variants={cardVariants} custom={2} whileHover={{ scale: 1.07, boxShadow: '0 8px 32px #06b6d422' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <AnimatedIcon type="spin"><FaMapMarkedAlt className="wc-lifestyle-icon" /></AnimatedIcon>
            <div className="wc-lifestyle-title">Community</div>
            <div className="wc-lifestyle-text">Join events, meetups, and connect with fellow room seekers.</div>
          </motion.div>
        </div>
      </motion.section >

      {/* Testimonials Section */}
      < motion.section className="wc-testimonials" initial="hidden" animate="visible" variants={sectionVariants} >
        <h2 className="wc-section-title">What Our Users Say</h2>
        <div className="wc-testimonials-grid">
          {testimonials.map((t, i) => (
            <motion.div className="wc-testimonial-card" key={i} custom={i} initial="hidden" animate="visible" variants={cardVariants} whileHover={{ scale: 1.04, boxShadow: '0 8px 32px #7c3aed22' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
              <div className="wc-testimonial-avatar">{t.avatar}</div>
              <div className="wc-testimonial-text">{t.text}</div>
              <div className="wc-testimonial-name">{t.name}</div>
            </motion.div>
          ))}
        </div>
      </motion.section >

      {/* Newsletter/Community CTA Section */}
      < motion.section className="wc-newsletter" initial="hidden" animate="visible" variants={sectionVariants} >
        <div className="wc-newsletter-inner">
          <h2 className="wc-section-title">Join Our Community</h2>
          <p className="wc-newsletter-text">Get the latest room listings, tips, and community news delivered to your inbox.</p>
          <form className="wc-newsletter-form" onSubmit={handleNewsletter}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="wc-newsletter-input"
              aria-label="Email address"
            />
            <motion.button className="wc-newsletter-btn" type="submit" whileHover={{ scale: 1.08, boxShadow: '0 4px 16px #7c3aed44' }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
              {submitted ? 'Thank you!' : 'Subscribe'}
            </motion.button>
          </form>
        </div>
      </motion.section >
    </div >
  );
}
