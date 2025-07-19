import React, { useState } from 'react';
import { motion } from 'framer-motion';

const StepRoomDetails = ({ data, updateData, next }) => {
  const [details, setDetails] = useState(data.details || {
    title: '',
    description: '',
    roomType: '',
    numBeds: '',
    floor: '',
    price: '', // Added price field
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!details.title.trim()) newErrors.title = 'Title is required.';
    if (!details.description.trim()) newErrors.description = 'Description is required.';
    else if (details.description.trim().length < 30) newErrors.description = 'Description must be at least 30 characters.';
    if (!details.roomType) newErrors.roomType = 'Room type is required.';
    if (!details.numBeds || isNaN(details.numBeds) || Number(details.numBeds) <= 0) newErrors.numBeds = 'Number of beds is required.';
    if (!details.price || isNaN(details.price) || Number(details.price) <= 0) newErrors.price = 'Price is required.'; // Price validation
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNext = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      updateData('details', details);
      next();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
        <h2 style={{
          fontSize: 'var(--font-size-3xl)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-2)',
        }}>
          Room Details
        </h2>
        <p style={{
          fontSize: 'var(--font-size-base)',
          color: 'var(--text-secondary)',
        }}>
          Tell us about your room and what makes it special
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-6)',
      }}>
        {/* Title */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)',
          }}>
            Room Title *
          </label>
          <input
            name="title"
            placeholder="e.g., Cozy Room in Downtown Kathmandu"
            value={details.title}
            onChange={handleChange}
            style={{
              width: '100%',
              height: 'var(--input-height)',
              padding: 'var(--input-padding)',
              fontSize: 'var(--font-size-base)',
              borderRadius: 'var(--input-radius)',
              border: errors.title ? 'var(--input-border-focus)' : 'var(--input-border)',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              transition: 'all var(--transition)',
            }}
          />
          {errors.title && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: 'var(--error)',
                fontSize: 'var(--font-size-sm)',
                marginTop: 'var(--space-1)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
              }}
            >
              ⚠️ {errors.title}
            </motion.div>
          )}
        </div>

        {/* Room Type */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)',
          }}>
            Room Type *
          </label>
          <select
            name="roomType"
            value={details.roomType}
            onChange={handleChange}
            style={{
              width: '100%',
              height: 'var(--input-height)',
              padding: 'var(--input-padding)',
              fontSize: 'var(--font-size-base)',
              borderRadius: 'var(--input-radius)',
              border: errors.roomType ? 'var(--input-border-focus)' : 'var(--input-border)',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              transition: 'all var(--transition)',
            }}
          >
            <option value="">Select type</option>
            <option value="Private">Private</option>
            <option value="Shared">Shared</option>
            <option value="Studio">Studio</option>
            <option value="Apartment">Apartment</option>
            <option value="Other">Other</option>
          </select>
          {errors.roomType && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: 'var(--error)',
                fontSize: 'var(--font-size-sm)',
                marginTop: 'var(--space-1)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
              }}
            >
              ⚠️ {errors.roomType}
            </motion.div>
          )}
        </div>

        {/* Number of Beds */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)',
          }}>
            Number of Beds *
          </label>
          <input
            name="numBeds"
            type="number"
            min="1"
            placeholder="e.g., 2"
            value={details.numBeds}
            onChange={handleChange}
            style={{
              width: '100%',
              height: 'var(--input-height)',
              padding: 'var(--input-padding)',
              fontSize: 'var(--font-size-base)',
              borderRadius: 'var(--input-radius)',
              border: errors.numBeds ? 'var(--input-border-focus)' : 'var(--input-border)',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              transition: 'all var(--transition)',
            }}
          />
          {errors.numBeds && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: 'var(--error)',
                fontSize: 'var(--font-size-sm)',
                marginTop: 'var(--space-1)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
              }}
            >
              ⚠️ {errors.numBeds}
            </motion.div>
          )}
        </div>

        {/* Price */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)',
          }}>
            Price (NPR) *
          </label>
          <input
            name="price"
            type="number"
            min="0"
            placeholder="e.g., 10000"
            value={details.price}
            onChange={handleChange}
            style={{
              width: '100%',
              height: 'var(--input-height)',
              padding: 'var(--input-padding)',
              fontSize: 'var(--font-size-base)',
              borderRadius: 'var(--input-radius)',
              border: errors.price ? 'var(--input-border-focus)' : 'var(--input-border)',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              transition: 'all var(--transition)',
            }}
          />
          {errors.price && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: 'var(--error)',
                fontSize: 'var(--font-size-sm)',
                marginTop: 'var(--space-1)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
              }}
            >
              ⚠️ {errors.price}
            </motion.div>
          )}
        </div>

        {/* Floor/Unit (optional) */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)',
          }}>
            Floor/Unit (optional)
          </label>
          <input
            name="floor"
            placeholder="e.g., 2nd Floor, Unit B"
            value={details.floor}
            onChange={handleChange}
            style={{
              width: '100%',
              height: 'var(--input-height)',
              padding: 'var(--input-padding)',
              fontSize: 'var(--font-size-base)',
              borderRadius: 'var(--input-radius)',
              border: 'var(--input-border)',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              transition: 'all var(--transition)',
            }}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label style={{
          display: 'block',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-2)',
        }}>
          Description *
        </label>
        <textarea
          name="description"
          placeholder="Describe the room, house, neighborhood, and what makes it special..."
          value={details.description}
          onChange={handleChange}
          rows={4}
          style={{
            width: '100%',
            padding: 'var(--input-padding)',
            fontSize: 'var(--font-size-base)',
            borderRadius: 'var(--input-radius)',
            border: errors.description ? 'var(--input-border-focus)' : 'var(--input-border)',
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            transition: 'all var(--transition)',
            resize: 'vertical',
            minHeight: '120px',
            fontFamily: 'var(--font-family)',
          }}
        />
        {errors.description && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              color: 'var(--error)',
              fontSize: 'var(--font-size-sm)',
              marginTop: 'var(--space-1)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
            }}
          >
            ⚠️ {errors.description}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StepRoomDetails;
