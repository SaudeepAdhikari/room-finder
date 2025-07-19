import React, { useState, useEffect } from 'react';
import './ModernPostRoomForm.css';
import { addRoom, addRoomWithImages } from '../../api';  // Import both API functions
import Upload360Form from '../../Upload360Form';

// Icons for form fields
import {
  FaHome, FaBed, FaRulerCombined, FaMapMarkerAlt, FaCity,
  FaMoneyBillWave, FaWifi, FaParking, FaSnowflake,
  FaShower, FaCouch, FaCalendarAlt, FaUserFriends, FaImage,
  FaInfoCircle, FaPencilAlt, FaFileUpload, FaRegCheckCircle,
  FaTimes, FaQuestionCircle, FaPhone, FaEnvelope,
  FaMapMarkedAlt, FaClipboardList, FaCheck, FaSpinner
} from 'react-icons/fa';

const ModernPostRoomForm = () => {
  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    roomType: '',
    roomSize: '',
    contactName: '',
    contactPhone: '+977-9842064469',
    contactEmail: '',

    // Location
    address: '',
    city: '',
    state: '',
    zipCode: '',

    // Details
    price: '',
    securityDeposit: '',
    availableFrom: '',
    minStayDuration: '',
    maxOccupants: '',

    // Amenities
    amenities: {
      wifi: false,
      parking: false,
      airConditioner: false,
      attachedBathroom: false,
      furnished: false,
      waterSupply: false,
      electricity: false,
      kitchen: false,
      laundry: false,
      balcony: false
    },

    // Gender preference
    genderPreference: '',

    // Images
    images: [],
    room360s: [] // Array of 360 URLs/metadata
  });

  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update mobile state on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Active section
  const [activeSection, setActiveSection] = useState('basic');

  // Progress state
  const [progress, setProgress] = useState(0);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Calculate form progress
  useEffect(() => {
    const calculateProgress = () => {
      const sections = {
        basic: ['title', 'description', 'roomType', 'roomSize', 'contactName', 'contactPhone', 'contactEmail'],
        location: ['address', 'city', 'state', 'zipCode'],
        details: ['price', 'availableFrom', 'minStayDuration', 'maxOccupants'],
        amenities: ['amenities'], // Special case
        preferences: ['genderPreference'],
        images: ['images']
      };

      const totalFields = Object.values(sections).flat().length;
      let filledFields = 0;

      // Count filled basic fields
      for (const section in sections) {
        if (section === 'amenities') {
          // Count checked amenities
          const checkedAmenities = Object.values(formData.amenities).filter(val => val).length;
          if (checkedAmenities > 0) filledFields += 1; // Count as one field if any amenity is checked
        } else {
          sections[section].forEach(field => {
            if (
              (Array.isArray(formData[field]) && formData[field].length > 0) ||
              (!Array.isArray(formData[field]) && formData[field])
            ) {
              filledFields += 1;
            }
          });
        }
      }

      return Math.round((filledFields / totalFields) * 100);
    };

    setProgress(calculateProgress());
  }, [formData]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field
    validateField(name, value);
  };

  // Handle checkbox change for amenities
  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [name]: checked
      }
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    // Create preview URLs for the images
    const imageURLs = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageURLs]
    }));
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Handle 360 upload
  const handle360Upload = (meta) => {
    setFormData(prev => ({
      ...prev,
      room360s: [...prev.room360s, meta]
    }));
  };

  // Validate a single field
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'title':
        if (!value) error = 'Title is required';
        else if (value.length < 10) error = 'Title should be at least 10 characters';
        break;
      case 'description':
        if (!value) error = 'Description is required';
        else if (value.length < 30) error = 'Description should be at least 30 characters';
        break;
      case 'roomType':
        if (!value) error = 'Room type is required';
        break;
      case 'roomSize':
        if (!value) error = 'Room size is required';
        break;
      case 'contactName':
        if (!value) error = 'Contact name is required';
        break;
      case 'contactPhone':
        if (!value) error = 'Contact phone is required';
        else if (!/^\d{10}$/.test(value)) error = 'Phone number should be 10 digits';
        break;
      case 'contactEmail':
        if (!value) error = 'Contact email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email format';
        break;
      case 'address':
        if (!value) error = 'Address is required';
        break;
      case 'city':
        if (!value) error = 'City is required';
        break;
      case 'state':
        if (!value) error = 'State is required';
        break;
      case 'zipCode':
        if (!value) error = 'ZIP code is required';
        else if (!/^\d{5}(-\d{4})?$/.test(value)) error = 'Invalid ZIP code format';
        break;
      case 'price':
        if (!value) error = 'Price is required';
        else if (isNaN(value) || parseFloat(value) <= 0) error = 'Price must be a positive number';
        break;
      case 'availableFrom':
        if (!value) error = 'Available date is required';
        break;
      case 'minStayDuration':
        if (value && (isNaN(value) || parseInt(value) <= 0)) error = 'Minimum stay must be a positive number';
        break;
      case 'maxOccupants':
        if (value && (isNaN(value) || parseInt(value) <= 0)) error = 'Max occupants must be a positive number';
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return !error;
  };

  // Validate the entire form
  const validateForm = () => {
    let isValid = true;
    const requiredFields = [
      'title', 'description', 'roomType', 'roomSize', 'contactName', 'contactPhone', 'contactEmail',
      'address', 'city', 'state', 'zipCode', 'price', 'availableFrom'
    ];

    requiredFields.forEach(field => {
      const valid = validateField(field, formData[field]);
      isValid = isValid && valid;
    });

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFieldsTouched = {};
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === 'object' && !Array.isArray(formData[key])) {
        Object.keys(formData[key]).forEach(subKey => {
          allFieldsTouched[`${key}.${subKey}`] = true;
        });
      } else {
        allFieldsTouched[key] = true;
      }
    });
    setTouched(allFieldsTouched);

    // Validate the entire form
    const isValid = validateForm();

    if (isValid) {
      setIsSubmitting(true);
      try {
        // Format the data according to the Room model expected by the API
        const roomData = {
          title: formData.title,
          description: formData.description,
          location: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
          price: Number(formData.price),
          amenities: Object.entries(formData.amenities)
            .filter(([_, isChecked]) => isChecked)
            .map(([name, _]) => name),
          roommatePreference: formData.genderPreference,
          // Additional fields from form
          roomType: formData.roomType,
          roomSize: formData.roomSize,
          contactInfo: {
            name: formData.contactName,
            phone: formData.contactPhone,
            email: formData.contactEmail
          },
          availableFrom: formData.availableFrom,
          room360s: formData.room360s,
        };

        if (formData.images && formData.images.length > 0) {
          // Extract the actual File objects for upload
          const imageFiles = formData.images.map(img => img.file);
          // Use the function with FormData for image uploads
          await addRoomWithImages(roomData, imageFiles);
        } else {
          // No images, use regular addRoom
          await addRoom(roomData);
        }
        console.log('Form submitted successfully:', roomData);
        alert('Room posted successfully!');

        // Reset form after successful submission
        setFormData({
          title: '',
          description: '',
          roomType: '',
          roomSize: '',
          contactName: '',
          contactPhone: '+977-9842064469',
          contactEmail: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          price: '',
          securityDeposit: '',
          availableFrom: '',
          minStayDuration: '',
          maxOccupants: '',
          amenities: {
            wifi: false,
            parking: false,
            airConditioner: false,
            attachedBathroom: false,
            furnished: false,
            waterSupply: false,
            electricity: false,
            kitchen: false,
            laundry: false,
            balcony: false
          },
          genderPreference: '',
          images: [],
          room360s: []
        });

        // Reset progress and active section
        setProgress(0);
        setActiveSection('basic');
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitError(error.message || 'Failed to post room. Please try again later.');
        alert('Failed to post room: ' + (error.message || 'Please try again later.'));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('Form has errors:', errors);
      alert('Please fix the errors before submitting.');
    }
  };

  // Navigation between sections
  const navigateToSection = (section) => {
    setActiveSection(section);

    // Scroll to the section
    const sectionElement = document.getElementById(section);
    const isMobile = window.innerWidth <= 768;

    if (sectionElement) {
      if (isMobile) {
        // On mobile, scroll to top of form container for better UX
        const formContainer = document.querySelector('.modern-form-container');
        if (formContainer) {
          window.scrollTo({
            top: formContainer.offsetTop - 20,
            behavior: 'smooth'
          });
        }
      } else {
        // On desktop, scroll to the specific section
        sectionElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  };

  // Get icon for input field
  const getInputIcon = (fieldName) => {
    switch (fieldName) {
      case 'title': return <FaPencilAlt />;
      case 'description': return <FaInfoCircle />;
      case 'roomType': return <FaHome />;
      case 'roomSize': return <FaRulerCombined />;
      case 'contactName': return <FaUserFriends />;
      case 'contactPhone': return <FaPhone />;
      case 'contactEmail': return <FaEnvelope />;
      case 'address': return <FaMapMarkerAlt />;
      case 'city': return <FaCity />;
      case 'state': return <FaMapMarkerAlt />;
      case 'zipCode': return <FaMapMarkerAlt />;
      case 'price': return <FaMoneyBillWave />;
      case 'securityDeposit': return <FaMoneyBillWave />;
      case 'availableFrom': return <FaCalendarAlt />;
      case 'minStayDuration': return <FaCalendarAlt />;
      case 'maxOccupants': return <FaUserFriends />;
      case 'genderPreference': return <FaUserFriends />;
      default: return <FaInfoCircle />;
    }
  };

  return (
    <div className="modern-form-container">
      {/* Progress bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        <div className="progress-text">{progress}% Complete</div>
      </div>

      {/* Desktop Form navigation */}
      <div className="form-navigation">
        <button
          type="button"
          className={activeSection === 'basic' ? 'active' : ''}
          onClick={() => navigateToSection('basic')}
        >
          <span className="nav-icon"><FaInfoCircle /></span>
          Basic Info
        </button>
        <button
          type="button"
          className={activeSection === 'location' ? 'active' : ''}
          onClick={() => navigateToSection('location')}
        >
          <span className="nav-icon"><FaMapMarkerAlt /></span>
          Location
        </button>
        <button
          type="button"
          className={activeSection === 'details' ? 'active' : ''}
          onClick={() => navigateToSection('details')}
        >
          <span className="nav-icon"><FaBed /></span>
          Details
        </button>
        <button
          type="button"
          className={activeSection === 'amenities' ? 'active' : ''}
          onClick={() => navigateToSection('amenities')}
        >
          <span className="nav-icon"><FaWifi /></span>
          Amenities
        </button>
        <button
          type="button"
          className={activeSection === 'preferences' ? 'active' : ''}
          onClick={() => navigateToSection('preferences')}
        >
          <span className="nav-icon"><FaUserFriends /></span>
          Preferences
        </button>
        <button
          type="button"
          className={activeSection === 'images' ? 'active' : ''}
          onClick={() => navigateToSection('images')}
        >
          <span className="nav-icon"><FaImage /></span>
          Images
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav-bar">
        <button
          type="button"
          className={`mobile-nav-button ${activeSection === 'basic' ? 'active' : ''}`}
          onClick={() => navigateToSection('basic')}
        >
          <span className="mobile-nav-icon"><FaInfoCircle /></span>
          Info
        </button>
        <button
          type="button"
          className={`mobile-nav-button ${activeSection === 'location' ? 'active' : ''}`}
          onClick={() => navigateToSection('location')}
        >
          <span className="mobile-nav-icon"><FaMapMarkedAlt /></span>
          Location
        </button>
        <button
          type="button"
          className={`mobile-nav-button ${activeSection === 'details' || activeSection === 'amenities' ? 'active' : ''}`}
          onClick={() => navigateToSection(activeSection === 'details' ? 'amenities' : 'details')}
        >
          <span className="mobile-nav-icon"><FaClipboardList /></span>
          Details
        </button>
        <button
          type="button"
          className={`mobile-nav-button ${activeSection === 'preferences' || activeSection === 'images' ? 'active' : ''}`}
          onClick={() => navigateToSection(activeSection === 'preferences' ? 'images' : 'preferences')}
        >
          <span className="mobile-nav-icon"><FaUserFriends /></span>
          More
        </button>
      </div>

      <form className="modern-form" onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <div id="basic" className={`form-section ${activeSection === 'basic' ? 'active' : ''}`}>
          <h2 className="section-title">
            <FaInfoCircle /> Basic Information
          </h2>

          <div className="form-row">
            <div className="form-group">
              <div className="input-container">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={touched.title && errors.title ? 'error' : ''}
                  required
                />
                <label htmlFor="title" className={formData.title ? 'float' : ''}>
                  Room Title
                </label>
                <div className="input-icon">{getInputIcon('title')}</div>
                {touched.title && errors.title && (
                  <div className="error-message" data-tooltip={errors.title}>
                    <FaTimes />
                  </div>
                )}
                {touched.title && !errors.title && (
                  <div className="success-icon">
                    <FaRegCheckCircle />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <div className="input-container">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={touched.description && errors.description ? 'error' : ''}
                  required
                ></textarea>
                <label htmlFor="description" className={formData.description ? 'float' : ''}>
                  Room Description
                </label>
                <div className="input-icon textarea-icon">{getInputIcon('description')}</div>
                {touched.description && errors.description && (
                  <div className="error-message" data-tooltip={errors.description}>
                    <FaTimes />
                  </div>
                )}
                {touched.description && !errors.description && (
                  <div className="success-icon">
                    <FaRegCheckCircle />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-row double">
            <div className="form-group">
              <div className="input-container">
                <select
                  id="roomType"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className={touched.roomType && errors.roomType ? 'error' : ''}
                  required
                >
                  <option value=""></option>
                  <option value="single">Single Room</option>
                  <option value="shared">Shared Room</option>
                  <option value="studio">Studio Apartment</option>
                  <option value="1bhk">1 BHK</option>
                  <option value="2bhk">2 BHK</option>
                  <option value="3bhk">3+ BHK</option>
                </select>
                <label htmlFor="roomType" className={formData.roomType ? 'float' : ''}>
                  Room Type
                </label>
                <div className="input-icon">{getInputIcon('roomType')}</div>
                {touched.roomType && errors.roomType && (
                  <div className="error-message" data-tooltip={errors.roomType}>
                    <FaTimes />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <input
                  type="text"
                  id="roomSize"
                  name="roomSize"
                  value={formData.roomSize}
                  onChange={handleChange}
                  className={touched.roomSize && errors.roomSize ? 'error' : ''}
                  required
                />
                <label htmlFor="roomSize" className={formData.roomSize ? 'float' : ''}>
                  Room Size (sq.ft)
                </label>
                <div className="input-icon">{getInputIcon('roomSize')}</div>
                {touched.roomSize && errors.roomSize && (
                  <div className="error-message" data-tooltip={errors.roomSize}>
                    <FaTimes />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-divider">
            <span>Contact Information</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <div className="input-container">
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className={touched.contactName && errors.contactName ? 'error' : ''}
                  required
                />
                <label htmlFor="contactName" className={formData.contactName ? 'float' : ''}>
                  Contact Name
                </label>
                <div className="input-icon">{getInputIcon('contactName')}</div>
                {touched.contactName && errors.contactName && (
                  <div className="error-message" data-tooltip={errors.contactName}>
                    <FaTimes />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-row double">
            <div className="form-group">
              <div className="input-container">
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className={touched.contactPhone && errors.contactPhone ? 'error' : ''}
                  required
                  placeholder="+977-9842064469"
                />
                <label htmlFor="contactPhone" className={formData.contactPhone ? 'float' : ''}>
                  Contact Phone
                </label>
                <div className="input-icon">{getInputIcon('contactPhone')}</div>
                {touched.contactPhone && errors.contactPhone && (
                  <div className="error-message" data-tooltip={errors.contactPhone}>
                    <FaTimes />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className={touched.contactEmail && errors.contactEmail ? 'error' : ''}
                  required
                />
                <label htmlFor="contactEmail" className={formData.contactEmail ? 'float' : ''}>
                  Contact Email
                </label>
                <div className="input-icon">{getInputIcon('contactEmail')}</div>
                {touched.contactEmail && errors.contactEmail && (
                  <div className="error-message" data-tooltip={errors.contactEmail}>
                    <FaTimes />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="section-nav">
            <button
              type="button"
              className="next-section"
              onClick={() => navigateToSection('location')}
            >
              Next: Location <span className="arrow">→</span>
            </button>
          </div>
        </div>

        {/* Location Section */}
        <div id="location" className={`form-section ${activeSection === 'location' ? 'active' : ''}`}>
          <h2 className="section-title">
            <FaMapMarkerAlt /> Location
          </h2>

          <div className="form-row">
            <div className="form-group">
              <div className="input-container">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={touched.address && errors.address ? 'error' : ''}
                  required
                />
                <label htmlFor="address" className={formData.address ? 'float' : ''}>
                  Street Address
                </label>
                <div className="input-icon">{getInputIcon('address')}</div>
                {touched.address && errors.address && (
                  <div className="error-message" data-tooltip={errors.address}>
                    <FaTimes />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-row triple">
            <div className="form-group">
              <div className="input-container">
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={touched.city && errors.city ? 'error' : ''}
                  required
                />
                <label htmlFor="city" className={formData.city ? 'float' : ''}>
                  City
                </label>
                <div className="input-icon">{getInputIcon('city')}</div>
                {touched.city && errors.city && (
                  <div className="error-message" data-tooltip={errors.city}>
                    <FaTimes />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={touched.state && errors.state ? 'error' : ''}
                  required
                />
                <label htmlFor="state" className={formData.state ? 'float' : ''}>
                  State
                </label>
                <div className="input-icon">{getInputIcon('state')}</div>
                {touched.state && errors.state && (
                  <div className="error-message" data-tooltip={errors.state}>
                    <FaTimes />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={touched.zipCode && errors.zipCode ? 'error' : ''}
                  required
                />
                <label htmlFor="zipCode" className={formData.zipCode ? 'float' : ''}>
                  ZIP Code
                </label>
                <div className="input-icon">{getInputIcon('zipCode')}</div>
                {touched.zipCode && errors.zipCode && (
                  <div className="error-message" data-tooltip={errors.zipCode}>
                    <FaTimes />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="map-preview">
            <div className="map-placeholder">
              <FaMapMarkerAlt />
              <p>Map preview will appear here after entering location</p>
            </div>
          </div>

          <div className="section-nav">
            <button
              type="button"
              className="prev-section"
              onClick={() => navigateToSection('basic')}
            >
              <span className="arrow">←</span> Previous: Basic Info
            </button>
            <button
              type="button"
              className="next-section"
              onClick={() => navigateToSection('details')}
            >
              Next: Details <span className="arrow">→</span>
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div id="details" className={`form-section ${activeSection === 'details' ? 'active' : ''}`}>
          <h2 className="section-title">
            <FaBed /> Room Details
          </h2>

          <div className="form-row double">
            <div className="form-group">
              <div className="input-container">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={touched.price && errors.price ? 'error' : ''}
                  required
                />
                <label htmlFor="price" className={formData.price ? 'float' : ''}>
                  Monthly Rent ($)
                </label>
                <div className="input-icon">{getInputIcon('price')}</div>
                {touched.price && errors.price && (
                  <div className="error-message" data-tooltip={errors.price}>
                    <FaTimes />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <input
                  type="number"
                  id="securityDeposit"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  className={touched.securityDeposit && errors.securityDeposit ? 'error' : ''}
                />
                <label htmlFor="securityDeposit" className={formData.securityDeposit ? 'float' : ''}>
                  Security Deposit ($)
                </label>
                <div className="input-icon">{getInputIcon('securityDeposit')}</div>
                {touched.securityDeposit && errors.securityDeposit && (
                  <div className="error-message" data-tooltip={errors.securityDeposit}>
                    <FaTimes />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <div className="input-container">
                <input
                  type="date"
                  id="availableFrom"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  className={touched.availableFrom && errors.availableFrom ? 'error' : ''}
                  required
                  placeholder="yyyy-mm-dd"
                />
                {/* Remove the label to prevent overlap, since the date input already shows a format */}
                <div className="input-icon">{getInputIcon('availableFrom')}</div>
                {touched.availableFrom && errors.availableFrom && (
                  <div className="error-message" data-tooltip={errors.availableFrom}>
                    <FaTimes />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-row double">
            <div className="form-group">
              <div className="input-container">
                <input
                  type="number"
                  id="minStayDuration"
                  name="minStayDuration"
                  value={formData.minStayDuration}
                  onChange={handleChange}
                  className={touched.minStayDuration && errors.minStayDuration ? 'error' : ''}
                />
                <label htmlFor="minStayDuration" className={formData.minStayDuration ? 'float' : ''}>
                  Minimum Stay (months)
                </label>
                <div className="input-icon">{getInputIcon('minStayDuration')}</div>
                {touched.minStayDuration && errors.minStayDuration && (
                  <div className="error-message" data-tooltip={errors.minStayDuration}>
                    <FaTimes />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <input
                  type="number"
                  id="maxOccupants"
                  name="maxOccupants"
                  value={formData.maxOccupants}
                  onChange={handleChange}
                  className={touched.maxOccupants && errors.maxOccupants ? 'error' : ''}
                />
                <label htmlFor="maxOccupants" className={formData.maxOccupants ? 'float' : ''}>
                  Max Occupants
                </label>
                <div className="input-icon">{getInputIcon('maxOccupants')}</div>
                {touched.maxOccupants && errors.maxOccupants && (
                  <div className="error-message" data-tooltip={errors.maxOccupants}>
                    <FaTimes />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="section-nav">
            <button
              type="button"
              className="prev-section"
              onClick={() => navigateToSection('location')}
            >
              <span className="arrow">←</span> Previous: Location
            </button>
            <button
              type="button"
              className="next-section"
              onClick={() => navigateToSection('amenities')}
            >
              Next: Amenities <span className="arrow">→</span>
            </button>
          </div>
        </div>

        {/* Amenities Section */}
        <div id="amenities" className={`form-section ${activeSection === 'amenities' ? 'active' : ''}`}>
          <h2 className="section-title">
            <FaWifi /> Amenities
          </h2>

          <div className="amenities-grid">
            <label className="amenity-checkbox">
              <input
                type="checkbox"
                name="wifi"
                checked={formData.amenities.wifi}
                onChange={handleAmenityChange}
              />
              <span className="amenity-icon"><FaWifi /></span>
              <span className="amenity-label">WiFi</span>
            </label>

            <label className="amenity-checkbox">
              <input
                type="checkbox"
                name="parking"
                checked={formData.amenities.parking}
                onChange={handleAmenityChange}
              />
              <span className="amenity-icon"><FaParking /></span>
              <span className="amenity-label">Parking</span>
            </label>

            <label className="amenity-checkbox">
              <input
                type="checkbox"
                name="airConditioner"
                checked={formData.amenities.airConditioner}
                onChange={handleAmenityChange}
              />
              <span className="amenity-icon"><FaSnowflake /></span>
              <span className="amenity-label">AC</span>
            </label>

            <label className="amenity-checkbox">
              <input
                type="checkbox"
                name="attachedBathroom"
                checked={formData.amenities.attachedBathroom}
                onChange={handleAmenityChange}
              />
              <span className="amenity-icon"><FaShower /></span>
              <span className="amenity-label">Attached Bathroom</span>
            </label>

            <label className="amenity-checkbox">
              <input
                type="checkbox"
                name="furnished"
                checked={formData.amenities.furnished}
                onChange={handleAmenityChange}
              />
              <span className="amenity-icon"><FaCouch /></span>
              <span className="amenity-label">Furnished</span>
            </label>

            <label className="amenity-checkbox">
              <input
                type="checkbox"
                name="waterSupply"
                checked={formData.amenities.waterSupply}
                onChange={handleAmenityChange}
              />
              <span className="amenity-icon"><FaShower /></span>
              <span className="amenity-label">Water Supply</span>
            </label>

            <label className="amenity-checkbox">
              <input
                type="checkbox"
                name="electricity"
                checked={formData.amenities.electricity}
                onChange={handleAmenityChange}
              />
              <span className="amenity-icon"><FaSnowflake /></span>
              <span className="amenity-label">Electricity</span>
            </label>

            <label className="amenity-checkbox">
              <input
                type="checkbox"
                name="kitchen"
                checked={formData.amenities.kitchen}
                onChange={handleAmenityChange}
              />
              <span className="amenity-icon"><FaHome /></span>
              <span className="amenity-label">Kitchen</span>
            </label>

            <label className="amenity-checkbox">
              <input
                type="checkbox"
                name="laundry"
                checked={formData.amenities.laundry}
                onChange={handleAmenityChange}
              />
              <span className="amenity-icon"><FaHome /></span>
              <span className="amenity-label">Laundry</span>
            </label>

            <label className="amenity-checkbox">
              <input
                type="checkbox"
                name="balcony"
                checked={formData.amenities.balcony}
                onChange={handleAmenityChange}
              />
              <span className="amenity-icon"><FaHome /></span>
              <span className="amenity-label">Balcony</span>
            </label>
          </div>

          <div className="section-nav">
            <button
              type="button"
              className="prev-section"
              onClick={() => navigateToSection('details')}
            >
              <span className="arrow">←</span> Previous: Details
            </button>
            <button
              type="button"
              className="next-section"
              onClick={() => navigateToSection('preferences')}
            >
              Next: Preferences <span className="arrow">→</span>
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div id="preferences" className={`form-section ${activeSection === 'preferences' ? 'active' : ''}`}>
          <h2 className="section-title">
            <FaUserFriends /> Preferences
          </h2>

          <div className="form-row">
            <div className="form-group">
              <label className="preference-label">Gender Preference</label>
              <div className="radio-group">
                <label className="radio-button">
                  <input
                    type="radio"
                    name="genderPreference"
                    value="any"
                    checked={formData.genderPreference === 'any'}
                    onChange={handleChange}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-label">Any</span>
                </label>

                <label className="radio-button">
                  <input
                    type="radio"
                    name="genderPreference"
                    value="male"
                    checked={formData.genderPreference === 'male'}
                    onChange={handleChange}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-label">Male</span>
                </label>

                <label className="radio-button">
                  <input
                    type="radio"
                    name="genderPreference"
                    value="female"
                    checked={formData.genderPreference === 'female'}
                    onChange={handleChange}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-label">Female</span>
                </label>
              </div>
            </div>
          </div>

          <div className="section-nav">
            <button
              type="button"
              className="prev-section"
              onClick={() => navigateToSection('amenities')}
            >
              <span className="arrow">←</span> Previous: Amenities
            </button>
            <button
              type="button"
              className="next-section"
              onClick={() => navigateToSection('images')}
            >
              Next: Images <span className="arrow">→</span>
            </button>
          </div>
        </div>

        {/* Images Section */}
        <div id="images" className={`form-section ${activeSection === 'images' ? 'active' : ''}`}>
          <h2 className="section-title">
            <FaImage /> Room Images
          </h2>

          <div className="image-upload-container">
            <label htmlFor="images" className="image-upload-label">
              <FaFileUpload />
              <span>Upload Images</span>
              <span className="upload-hint">Click to select or drag & drop</span>
            </label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="image-upload-input"
            />
          </div>

          {formData.images.length > 0 && (
            <div className="image-preview-container">
              <h3>Uploaded Images</h3>
              <div className="image-preview-grid">
                {formData.images.map((image, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={image.preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ margin: '32px 0' }}>
            <h3>Upload 360° Room Image/Video</h3>
            <Upload360Form onUpload={handle360Upload} />
            {formData.room360s.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h4>Uploaded 360° Media:</h4>
                <ul>
                  {formData.room360s.map((item, idx) => (
                    <li key={idx}>{item.title} ({item.roomId})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="section-nav">
            <button
              type="button"
              className="prev-section"
              onClick={() => navigateToSection('preferences')}
            >
              <span className="arrow">←</span> Previous: Preferences
            </button>

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? <FaSpinner className="spinner" /> : 'Post Room'}
            </button>
          </div>
        </div>
      </form>

      {/* Desktop Help Button */}
      <div className="form-help">
        <button type="button" className="help-button">
          <FaQuestionCircle />
          <span>Need Help?</span>
        </button>
      </div>

      {/* Mobile Help Button */}
      <button type="button" className="mobile-help-button">
        <FaQuestionCircle />
      </button>
    </div>
  );
};

export default ModernPostRoomForm;
