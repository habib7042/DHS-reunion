
import React, { useState } from 'react';
import { Registration } from '../types';
import { Search, AlertCircle, CheckCircle, Clock, ArrowRight, Loader } from 'lucide-react';
import { registrationService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

interface StatusCheckProps {
  onFound: (registration: Registration) => void;
}

export const StatusCheck: React.FC<StatusCheckProps> = ({ onFound }) => {
  const { t } = useLanguage();
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
          setError(t('rejected_error'));
        } else {
           // It's pending
           setError("pending_signal"); 
        }
      } else {
        setError(t('not_found_error'));
      }
    } catch (err) {
      setError(t('connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const pendingRegistration = error === "pending_signal";

  return (
    <div className="max-w-md mx-auto my-12 px-4 animate-fade-in font-sans">
      <div className="text-center mb-8">
        <div className="inline-flex p-4 bg-blue-50 text-school-primary rounded-full mb-4">
          <Search className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-800">{t('check_title')}</h2>
        <p className="text-slate-600 mt-2">{t('check_subtitle')}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        {pendingRegistration ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-amber-800 mb-2">{t('status_pending_title')}</h3>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
              {t('status_pending_desc')}
              <br/><br/>
              {t('check_later')}
            </p>
            <button 
              onClick={() => setError('')}
              className="text-school-primary font-bold text-sm hover:underline"
            >
              {t('check_another')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('mobile_no')}</label>
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
              <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('ssc_year')}</label>
              <select 
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary/20 transition-all bg-white"
              >
                <option value="">{t('select_year_prompt')}</option>
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
              {loading ? t('searching') : t('btn_find_card')} 
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
