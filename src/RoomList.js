import React, { useEffect, useState } from 'react';
import { fetchRooms } from './api';
import { motion } from 'framer-motion';

function RoomList({ search = '', category = '' }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.location = search;
    if (category) params.category = category;
    fetchRooms(params)
      .then(setRooms)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [search, category]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'var(--space-12)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--gray-200)',
            borderTop: '3px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-size-base)',
          }}>
            Loading rooms...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'var(--space-12)',
      }}>
        <div style={{
          textAlign: 'center',
          color: 'var(--error)',
        }}>
          <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}>
            ⚠️ Error loading rooms
          </p>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-secondary)' }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'var(--space-12)',
      }}>
        <div style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
        }}>
          <div style={{
            fontSize: 'var(--font-size-4xl)',
            marginBottom: 'var(--space-4)',
          }}>
            🏠
          </div>
          <h3 style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 600,
            marginBottom: 'var(--space-2)',
            color: 'var(--text-primary)',
          }}>
            No rooms found
          </h3>
          <p style={{ fontSize: 'var(--font-size-base)' }}>
            Try adjusting your search criteria or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 'var(--space-6)',
      }}>
        {rooms.map((room, index) => (
          <motion.div
            key={room._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--gray-200)',
              overflow: 'hidden',
              transition: 'all var(--transition)',
            }}
          >
            {/* Room Image */}
            {room.imageUrl && (
              <div style={{
                height: '200px',
                background: `url(${room.imageUrl}) center/cover`,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 'var(--space-3)',
                  right: 'var(--space-3)',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 600,
                }}>
                  NPR {room.price?.toLocaleString()}
                </div>
              </div>
            )}

            {/* Room Content */}
            <div style={{ padding: 'var(--space-6)' }}>
              <h3 style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-2)',
                lineHeight: 1.3,
              }}>
                {room.title}
              </h3>

              <p style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--font-size-base)',
                marginBottom: 'var(--space-4)',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {room.description}
              </p>

              {/* Room Details */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-4)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--text-secondary)',
                }}>
                  <span>📍</span>
                  <span>{room.location}</span>
                </div>

                {room.amenities && room.amenities.length > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-secondary)',
                  }}>
                    <span>✨</span>
                    <span>{room.amenities.slice(0, 3).join(', ')}</span>
                    {room.amenities.length > 3 && (
                      <span style={{ color: 'var(--text-tertiary)' }}>
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Price and Action */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
              }}>
                <div>
                  <div style={{
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 700,
                    color: 'var(--primary)',
                  }}>
                    NPR {room.price?.toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-tertiary)',
                  }}>
                    per month
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'var(--primary-gradient)',
                    color: 'var(--text-inverse)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    padding: 'var(--space-2) var(--space-4)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all var(--transition)',
                  }}
                >
                  View Details
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default RoomList;
