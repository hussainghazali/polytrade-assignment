import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

function Dashboard() {
  // Sample data for subscriptions and total amount invested
  const [subscriptionData, setSubscriptionData] = useState([100, 150, 200, 250, 300]);
  const [investmentData, setInvestmentData] = useState([500, 1000, 1500, 2000, 2500]);

  useEffect(() => {
    // Initialize investment chart
    const investmentChartContext = document.getElementById('investment-chart').getContext('2d');
    new Chart(investmentChartContext, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Total Amount Invested',
          data: investmentData,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }, [subscriptionData, investmentData]);

  return (
    <div className="bg-white min-h-screen">
      {/* Top header */}
      <header className="bg-white shadow">
        <div className="container mx-auto py-4 px-6">
          <h2 className="text-lg font-semibold text-gray-900">Welcome to your Dashboard</h2>
        </div>
      </header>
      {/* Page content */}
      <div className="container mx-auto py-8 px-6 flex flex-wrap gap-8">
        {/* Analytics graphs */}
        <div className="flex-1">

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Total Amount Invested</h3>
            <canvas id="investment-chart" width="400" height="200"></canvas>
          </div>
        </div>
        {/* Subscribed magazines table */}
        <div className="flex-1">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Subscribed Magazines</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Magazine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* List of subscribed magazines */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Magazine 1</td>
                  <td className="px-6 py-4 whitespace-nowrap">2022-01-01</td>
                  <td className="px-6 py-4 whitespace-nowrap">$10</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Magazine 2</td>
                  <td className="px-6 py-4 whitespace-nowrap">2022-02-01</td>
                  <td className="px-6 py-4 whitespace-nowrap">$15</td>
                </tr>
                {/* Add more rows for other magazines */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );  
}

export default Dashboard;
