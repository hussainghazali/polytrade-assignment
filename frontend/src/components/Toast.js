import React from 'react';

const Toast = ({ message }) => {
  return (
    <div
      className="fixed top-4 right-4 z-50 p-4 bg-white text-black rounded-md shadow-md flex items-center"
      style={{ maxWidth: '300px' }}
    >
      {/* Green tick icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 mr-2 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      {/* Message */}
      <p>{message}</p>
    </div>
  );
}

export default Toast;
