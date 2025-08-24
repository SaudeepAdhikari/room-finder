import React from 'react';

const TailwindTest = () => {
  return (
    <div className="p-8 bg-blue-500 text-white">
      <h1 className="text-4xl font-bold mb-4">Tailwind CSS Test</h1>
      <p className="text-lg">If you can see this styled correctly, Tailwind is working!</p>
      <div className="mt-4 p-4 bg-red-500 rounded-lg">
        <p className="text-yellow-300">This should be a red box with yellow text.</p>
      </div>
    </div>
  );
};

export default TailwindTest;
