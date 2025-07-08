import React, { useState } from 'react';
import StepRoomDetails from './StepRoomDetails';
import StepImages from './StepImages';
import StepLocation from './StepLocation';
import StepAmenities from './StepAmenities';
import StepPreview from './StepPreview';
import StepRoommatePreference from './StepRoommatePreference';
import StepAvailabilityCalendar from './StepAvailabilityCalendar';
import StepRentDocuments from './StepRentDocuments';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { label: 'Room Details', component: StepRoomDetails, icon: '🏠' },
  { label: 'Images', component: StepImages, icon: '📸' },
  { label: 'Location', component: StepLocation, icon: '📍' },
  { label: 'Amenities', component: StepAmenities, icon: '✨' },
  { label: 'Roommate Preference', component: StepRoommatePreference, icon: '👥' },
  { label: 'Availability', component: StepAvailabilityCalendar, icon: '📅' },
  { label: 'Documents', component: StepRentDocuments, icon: '📄' },
  { label: 'Preview', component: StepPreview, icon: '👁️' },
];

const MultiStepForm = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    details: {},
    images: [],
    location: null,
    amenities: [],
    roommatePreference: '',
    availabilityCalendar: [],
    rentDocuments: [],
  });

  const StepComponent = steps[currentStep].component;

  const next = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const updateData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      {/* Modern Stepper */}
      <div
        style={{
          width: '100%',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          marginBottom: 'var(--space-10)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            position: 'relative',
            padding: '0 var(--space-4)',
            gap: 0,
            minHeight: 110,
            minWidth: 600,
            width: '100%',
          }}
        >
          {/* Progress Line */}
          <div style={{
            position: 'absolute',
            top: 54,
            left: '7%',
            right: '7%',
            height: 4,
            background: 'linear-gradient(90deg, #e0e7ef 0%, #a5b4fc 100%)',
            borderRadius: 2,
            zIndex: 0,
          }} />
          <motion.div
            style={{
              position: 'absolute',
              top: 54,
              left: '7%',
              height: 4,
              background: 'linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)',
              borderRadius: 2,
              zIndex: 1,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 86}%` }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 120 }}
          />
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;
            const isUpcoming = idx > currentStep;
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 2,
                  flex: 1,
                  minWidth: 80,
                  maxWidth: 120,
                  gap: 8,
                  cursor: isCompleted ? 'pointer' : 'default',
                  touchAction: 'manipulation',
                }}
                onClick={() => isCompleted && setCurrentStep(idx)}
                tabIndex={0}
                title={step.label}
                aria-label={step.label}
              >
                <motion.div
                  whileHover={isCompleted ? { scale: 1.12 } : {}}
                  whileTap={isCompleted ? { scale: 0.96 } : {}}
                  style={{
                    width: isActive ? 54 : 44,
                    height: isActive ? 54 : 44,
                    borderRadius: '50%',
                    background: isCompleted
                      ? 'linear-gradient(135deg, #10b981 0%, #7c3aed 100%)'
                      : isActive
                        ? 'linear-gradient(135deg, #fbbf24 0%, #7c3aed 100%)'
                        : 'var(--gray-100)',
                    color: isCompleted || isActive ? '#fff' : 'var(--gray-400)',
                    fontWeight: 700,
                    fontSize: isActive ? 32 : 26,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isActive ? '0 4px 24px #7c3aed33' : isCompleted ? '0 2px 8px #10b98122' : 'none',
                    border: isActive ? '3px solid #fbbf24' : isCompleted ? '2px solid #10b981' : '2px solid #e0e7ef',
                    marginBottom: 6,
                    marginTop: 2,
                    transition: 'all var(--transition)',
                    opacity: isUpcoming ? 0.5 : 1,
                  }}
                >
                  {isCompleted ? '✓' : step.icon}
                </motion.div>
            <div style={{
                  fontSize: isActive ? 17 : 15,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#232946' : isCompleted ? '#10b981' : '#b0b8c9',
                  textAlign: 'center',
                  maxWidth: 90,
                  lineHeight: 1.2,
                  opacity: isUpcoming ? 0.5 : 1,
                  letterSpacing: isActive ? 0.1 : 0,
                  marginBottom: 2,
                  userSelect: 'none',
                }}>
                  {step.label}
                </div>
              </motion.div>
            );
          })}
          </div>
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-8)',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--gray-200)',
        }}
      >
      <StepComponent
        data={formData}
        updateData={updateData}
        next={next}
        back={back}
        isLast={currentStep === steps.length - 1}
        isFirst={currentStep === 0}
          onNavigate={onNavigate}
      />
      </motion.div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'var(--space-6)',
        gap: 'var(--space-4)',
      }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={back}
          disabled={currentStep === 0}
          style={{
            background: currentStep === 0 ? 'var(--gray-200)' : 'var(--surface)',
            color: currentStep === 0 ? 'var(--text-tertiary)' : 'var(--text-primary)',
            border: '1px solid var(--gray-200)',
            borderRadius: 'var(--radius)',
            padding: 'var(--space-3) var(--space-6)',
            fontSize: 'var(--font-size-base)',
            fontWeight: 600,
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition)',
            opacity: currentStep === 0 ? 0.5 : 1,
          }}
        >
          ← Back
        </motion.button>

        <div style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-secondary)',
          fontWeight: 500,
        }}>
          Step {currentStep + 1} of {steps.length}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={next}
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
            boxShadow: 'var(--shadow-sm)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--primary-gradient-hover)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--primary-gradient)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Next →'}
        </motion.button>
      </div>
    </div>
  );
};

export default MultiStepForm;
