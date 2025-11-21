
import React, { useState } from 'react';
import { Registration } from '../types';
import { Search, AlertCircle, CheckCircle, Clock, ArrowRight, Loader } from 'lucide-react';
import { registrationService } from '../services/api';

interface StatusCheckProps {
  // registrations prop removed as we fetch internally now
  onFound: (registration: Registration) => void;
}

export const StatusCheck: React.FC<StatusCheckProps> = ({ onFound }) => {
  const [mobile, setMobile] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const found = await registrationService.findRegistration(mobile, year);

      if (found) {
        if (found.status === 'approved') {
          onFound(found);
        } else if (found.status === 'rejected') {
          setError("This registration has been declined. Please contact support.");
        } else {
           // It's pending, show message but don't navigate
           setError("pending_signal"); 
        }
      } else {
        setError("No registration found with these details. Please check and try again.");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If we found a pending one, we show the UI here instead of navigating
  const pendingRegistration = error === "pending_signal";

  return (
    <div className="max-w-md mx-auto my-12 px-4 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex p-4 bg-blue-50 text-school-primary rounded-full mb-4">
          <Search className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-800">Download Entry Card</h2>
        <p className="text-slate-600 mt-2">Enter your details to check status and download your ID.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        {pendingRegistration ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-amber-800 mb-2">Payment Under Review</h3>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
              We have received your submission. The admin team is currently verifying your payment transaction. 
              <br/><br/>
              Please check back later.
            </p>
            <button 
              onClick={() => setError('')}
              className="text-school-primary font-bold text-sm hover:underline"
            >
              Check another number
            </button>
          </div>
        ) : (
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Mobile Number</label>
              <input 
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary/20 transition-all"
                placeholder="01XXXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">SSC Year</label>
              <select 
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary/20 transition-all bg-white"
              >
                <option value="">Select Year</option>
                {Array.from({ length: 96 }, (_, i) => 2025 - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {error && !pendingRegistration && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className={`w-full bg-school-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-800 transition-all flex items-center justify-center ${loading ? 'opacity-75 cursor-wait' : ''}`}
            >
              {loading ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <ArrowRight className="w-5 h-5 ml-2" />}
              {loading ? 'Searching...' : 'Find My Card'} 
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
