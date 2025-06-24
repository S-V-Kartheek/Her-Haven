import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function HealthReportPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Assuming a default user ID for now
  const userId = 1; 
  const backendUrl = 'http://localhost:5001'; // Updated port to 5001

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`${backendUrl}/health_report/${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch health report');
        }
        const data = await response.json();
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [userId, backendUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        Loading report...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  }

  // Basic rendering of the report data - this can be enhanced later
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Health Report for User {userId}</h1>
          {
            report ? (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(report, null, 2)}
              </pre>
            ) : (
              <p>No report data available.</p>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default HealthReportPage; 