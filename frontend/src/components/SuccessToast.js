import React from 'react';

const SuccessToast = ({ message }) => {
    return (
        <div
            className="fixed top-4 right-4 z-50 p-4 bg-green-500 text-white rounded-md shadow-md"
            style={{ maxWidth: '300px' }}
        >
            {message}
        </div>
    );
}

export default SuccessToast;
