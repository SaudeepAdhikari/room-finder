import React from 'react';

function ReviewsSection({ reviews }) {
  return (
    <div className="mt-8">
      <h3 className="mb-4 text-xl font-bold">Reviews</h3>
      <div className="flex gap-6 flex-wrap">
        {reviews.map((r,i) => (
          <div key={i} className="card min-w-[220px] max-w-[320px] p-4">
            <div className="text-yellow-400 text-lg mb-2">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
            <div className="italic text-base mb-2">"{r.text}"</div>
            <div className="font-bold text-lg">{r.user}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewsSection;
