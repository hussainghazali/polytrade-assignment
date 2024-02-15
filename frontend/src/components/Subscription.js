import React, { useState, useEffect } from 'react';

const SubscriptionTable = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const subscriptionsPerPage = 7;

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found in session storage');
        }

        const response = await fetch('http://localhost:3001/subscriptions/users/da61ec17-e597-4d62-b672-338556a0a309', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch subscriptions');
        }

        const responseData = await response.json();
        setSubscriptions(responseData.data.data);
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleUnsubscribe = async (subscriptionId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found in session storage');
      }

      const response = await fetch(`http://localhost:3001/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to unsubscribe');
      }

      // Update subscriptions list after successful unsubscribe
      const updatedSubscriptions = subscriptions.filter(subscription => subscription.id !== subscriptionId);
      setSubscriptions(updatedSubscriptions);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Logic to calculate current subscriptions to display
  const indexOfLastSubscription = currentPage * subscriptionsPerPage;
  const indexOfFirstSubscription = indexOfLastSubscription - subscriptionsPerPage;
  const currentSubscriptions = subscriptions.slice(indexOfFirstSubscription, indexOfLastSubscription);

  // Logic to paginate
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-4 shadow-md rounded-md">
        <h2 className="text-lg font-semibold mb-4">Subscriptions</h2>
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table header */}
          <thead className="bg-gray-50">
          <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Magazine</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentSubscriptions.map(subscription => (
              <tr key={subscription.id}>
                <td className="px-6 py-4 whitespace-nowrap">{subscription.magazine}</td>
                <td className="px-6 py-4 whitespace-nowrap">{subscription.startDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{subscription.endDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{subscription.cancelled ? 'Not Active' : 'Active'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleUnsubscribe(subscription.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                  >
                    Unsubscribe
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md border ${currentPage === 1 ? 'bg-gray-200 text-gray-700' : 'bg-blue-500 text-white'}`}
          >
            Previous
          </button>
          <div>
            {Array.from({ length: Math.ceil(currentSubscriptions.length / subscriptionsPerPage) }).map((_, index) => (
              <button
                key={index}
                className={`mx-1 px-4 py-2 rounded-md border ${
                  currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1 + (currentPage - 1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentSubscriptions.length < subscriptionsPerPage}
            className={`px-4 py-2 rounded-md border ${currentSubscriptions.length < subscriptionsPerPage ? 'bg-gray-200 text-gray-700' : 'bg-blue-500 text-white'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTable;
