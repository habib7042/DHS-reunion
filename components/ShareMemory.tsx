
import React, { useState, useEffect } from 'react';
import { memoryService } from '../services/api';
import { Sparkles, Send, CheckCircle, AlertCircle, Lock, Wand2, Calendar } from 'lucide-react';

interface ShareMemoryProps {
  onSuccess: () => void;
  preVerifiedStudent?: { fullName: string; sscYear: number };
}

export const ShareMemory: React.FC<ShareMemoryProps> = ({ onSuccess, preVerifiedStudent }) => {
  const [step, setStep] = useState<'verify' | 'write'>('verify');
  
  // Verification State
  const [mobile, setMobile] = useState('');
  const [sscYear, setSscYear] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  
  // User Data after verification
  const [userData, setUserData] = useState<{studentName: string, sscYear: number} | null>(null);

  // Writing State
  const [text, setText] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (preVerifiedStudent) {
      setUserData({
        studentName: preVerifiedStudent.fullName,
        sscYear: preVerifiedStudent.sscYear
      });
      setStep('write');
    }
  }, [preVerifiedStudent]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    try {
      const result = await memoryService.verifyUser(mobile, sscYear);
      if (result && result.verified) {
        setUserData({ studentName: result.studentName, sscYear: result.sscYear });
        setStep('write');
      }
    } catch (err: any) {
      // Display the specific error from backend (e.g., "You are not approved user")
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRefine = async () => {
    if (!text.trim()) return;
    setIsRefining(true);
    try {
      const refined = await memoryService.refineText(text);
      setText(refined.trim());
    } catch (err) {
      // If AI fails, keep original text
    } finally {
      setIsRefining(false);
    }
  };

  const handleSubmit = async () => {
    if (!userData || !text.trim()) return;
    setIsSubmitting(true);
    try {
      await memoryService.create({
        studentName: userData.studentName,
        sscYear: userData.sscYear,
        text: text
      });
      onSuccess();
      if (!preVerifiedStudent) {
        setStep('verify'); // Reset if not pre-verified
        setMobile('');
        setSscYear('');
      }
      setText('');
    } catch (err) {
      setError('Failed to share memory.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Years generation for dropdown
  const years = Array.from({ length: 97 }, (_, i) => 2026 - i);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
      <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
        <h3 className="font-bold flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-indigo-300" /> Share a Memory
        </h3>
        {userData && <span className="text-xs bg-indigo-500 px-2 py-1 rounded">{userData.studentName}</span>}
      </div>

      <div className="p-6">
        {step === 'verify' ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-sm text-slate-600">Only approved alumni can share memories. Verify your details.</p>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Mobile Number</label>
              <input 
                type="tel" 
                placeholder="01XXXXXXXXX"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">SSC Batch Year</label>
              <div className="relative">
                 <select 
                    value={sscYear}
                    onChange={e => setSscYear(e.target.value)}
                    className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none bg-white"
                    required
                 >
                    <option value="">Select Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                 </select>
                 <Calendar className="w-4 h-4 absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 p-3 rounded-lg flex items-start">
                 <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 shrink-0"/> 
                 <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isVerifying}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors flex justify-center items-center"
            >
              {isVerifying ? 'Checking...' : <><Lock className="w-4 h-4 mr-2" /> Verify & Continue</>}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">YOUR MEMORY (Max 50 words)</label>
              <textarea 
                value={text}
                onChange={e => setText(e.target.value)}
                className="w-full p-3 border rounded-lg text-sm h-24 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                placeholder={preVerifiedStudent ? `What's on your mind, ${preVerifiedStudent.fullName}?` : "Write something about your school days..."}
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleRefine}
                disabled={isRefining || !text}
                className="flex-1 bg-purple-100 text-purple-700 py-2 rounded-lg text-xs font-bold hover:bg-purple-200 transition-colors flex justify-center items-center"
              >
                {isRefining ? 'Fixing...' : <><Wand2 className="w-3 h-3 mr-1" /> Magic Fix</>}
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || !text}
                className="flex-[2] bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex justify-center items-center"
              >
                {isSubmitting ? 'Posting...' : <><Send className="w-3 h-3 mr-1" /> Share to Wall</>}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center">Using "Magic Fix" corrects grammar with AI.</p>
          </div>
        )}
      </div>
    </div>
  );
};
