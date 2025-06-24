import React, { useState } from 'react';
import SupportSafeNavbar from '../components/SupportSafeNavbar';

function HealthTracker() {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({
    date: '',
    symptoms: '',
    medications: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setReports([...reports, { ...newReport, id: Date.now() }]);
    setNewReport({
      date: '',
      symptoms: '',
      medications: '',
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SupportSafeNavbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Health Tracker</h1>
          
          {/* Add New Report Form */}
          <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Health Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newReport.date}
                  onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                <input
                  type="text"
                  value={newReport.symptoms}
                  onChange={(e) => setNewReport({ ...newReport, symptoms: e.target.value })}
                  placeholder="Enter symptoms"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medications</label>
                <input
                  type="text"
                  value={newReport.medications}
                  onChange={(e) => setNewReport({ ...newReport, medications: e.target.value })}
                  placeholder="Enter medications"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newReport.notes}
                  onChange={(e) => setNewReport({ ...newReport, notes: e.target.value })}
                  placeholder="Additional notes"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Add Report
            </button>
          </form>

          {/* Reports List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Health Reports</h2>
            {reports.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reports yet. Add your first health report above.</p>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{report.date}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Report</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Symptoms</p>
                      <p className="text-gray-800">{report.symptoms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Medications</p>
                      <p className="text-gray-800">{report.medications || 'None'}</p>
                    </div>
                    {report.notes && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 mb-1">Notes</p>
                        <p className="text-gray-800">{report.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthTracker; 