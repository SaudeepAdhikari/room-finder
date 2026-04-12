import React, { useState } from 'react';
import { createReview } from './api';
import './ReviewForm.css';

function ReviewForm({ roomId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (comment.trim().length < 5) {
      setError('Comment must be at least 5 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await createReview(roomId, rating, comment);
      setMessage('Review submitted successfully! It will be visible once approved by an admin.');
      setRating(0);
      setComment('');
      
      // Call the callback if provided
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3 className="review-form-title">Leave a Review</h3>
      
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label className="form-label">Rating *</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star ${star <= rating ? 'filled' : 'empty'}`}
                onClick={() => handleStarClick(star)}
                title={`${star} star${star > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && <span className="rating-text">{rating} out of 5 stars</span>}
        </div>

        <div className="form-group">
          <label htmlFor="comment" className="form-label">Comment *</label>
          <textarea
            id="comment"
            className="form-textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience... (minimum 5 characters)"
            rows="4"
            maxLength="1000"
          />
          <div className="char-count">{comment.length}/1000</div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      <p className="form-note">
        Note: Your review will be visible to others once it's approved by an admin.
      </p>
    </div>
  );
}

export default ReviewForm;
