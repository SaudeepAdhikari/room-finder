import React, { useState } from 'react';
import { motion } from 'framer-motion';

const StepRoomDetails = ({ data, updateData, next }) => {
  const [details, setDetails] = useState(data.details || {
    title: '',
    description: '',
    price: '',
    availableFrom: '',
    availableTo: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!details.title.trim()) newErrors.title = 'Title is required.';
    if (!details.description.trim()) newErrors.description = 'Description is required.';
    if (!details.price || isNaN(details.price) || Number(details.price) <= 0) newErrors.price = 'Valid price is required.';
    if (!details.availableFrom) newErrors.availableFrom = 'Available from date is required.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
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

        {/* Price */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)',
          }}>
            Monthly Rent (NPR) *
          </label>
          <input
            name="price"
            type="number"
            min="0"
            placeholder="e.g., 15000"
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--space-6)',
      }}>
        {/* Available From */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)',
          }}>
            Available From *
          </label>
          <input
            name="availableFrom"
            type="date"
            value={details.availableFrom}
            onChange={handleChange}
            style={{
              width: '100%',
              height: 'var(--input-height)',
              padding: 'var(--input-padding)',
              fontSize: 'var(--font-size-base)',
              borderRadius: 'var(--input-radius)',
              border: errors.availableFrom ? 'var(--input-border-focus)' : 'var(--input-border)',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              transition: 'all var(--transition)',
            }}
          />
          {errors.availableFrom && (
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
              ⚠️ {errors.availableFrom}
            </motion.div>
          )}
        </div>

        {/* Available To */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)',
          }}>
            Available To (Optional)
          </label>
          <input
            name="availableTo"
            type="date"
            value={details.availableTo}
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

      <motion.button
        onClick={handleNext}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          marginTop: 'var(--space-6)',
          width: '100%',
          height: 'var(--btn-height)',
          background: 'var(--primary-gradient)',
          color: 'var(--text-inverse)',
          border: 'none',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--font-size-lg)',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all var(--transition)',
          boxShadow: 'var(--shadow-md)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--primary-gradient-hover)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--primary-gradient)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
      >
        Continue to Images →
      </motion.button>
    </motion.div>
  );
};

export default StepRoomDetails;
