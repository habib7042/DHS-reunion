import React, { useState, useEffect, useRef } from 'react';
import { Registration } from '../types';
import { Lock, CheckCircle, XCircle, Search, DollarSign, Calendar, Smartphone, User, QrCode, X, AlertTriangle } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface AdminDashboardProps {
  registrations: Registration[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onLogin: () => void;
  isAuthenticated: boolean;
}

interface ScanResult {
  status: 'success' | 'error' | 'warning';
  title: string;
  message: string;
  data?: Registration;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  registrations, 
  onApprove, 
  onReject, 
  onLogin, 
  isAuthenticated 
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  
  // Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin2026') { 
      onLogin();
      setError('');
    } else {
      setError('Invalid admin password');
    }
  };

  // Initialize Scanner when isScanning becomes true
  useEffect(() => {
    if (isScanning) {
      // Small timeout to ensure DOM element exists
      const timeoutId = setTimeout(() => {
        const scanner = new Html5QrcodeScanner(
          "reader",
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        if (scannerRef.current) {
          scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
        }
      };
    }
  }, [isScanning]);

  const onScanSuccess = (decodedText: string) => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
    setIsScanning(false);
    verifyTicket(decodedText);
  };

  const onScanFailure = (error: any) => {
    // console.warn(`Code scan error = ${error}`);
  };

  const verifyTicket = (qrData: string) => {
    try {
      // The QR code contains JSON: { id: ticketId, name: fullName, year: sscYear }
      const parsed = JSON.parse(qrData);
      const ticketId = parsed.id;

      if (!ticketId) throw new Error("Invalid QR Data");

      // Search in loaded registrations
      const match = registrations.find(r => r.ticket.ticketId === ticketId);

      if (!match) {
        setScanResult({
          status: 'error',
          title: 'Invalid Ticket',
          message: `Ticket ID ${ticketId} does not exist in the database.`
        });
        return;
      }

      if (match.status === 'approved') {
        setScanResult({
          status: 'success',
          title: 'Verified Access',
          message: `${match.student.fullName} is authorized to enter.`,
          data: match
        });
      } else if (match.status === 'pending') {
        setScanResult({
          status: 'warning',
          title: 'Payment Pending',
          message: 'This ticket exists but payment is NOT verified yet.',
          data: match
        });
      } else {
        setScanResult({
          status: 'error',
          title: 'Ticket Rejected',
          message: 'This registration was previously rejected.',
          data: match
        });
      }

    } catch (e) {
      setScanResult({
        status: 'error',
        title: 'Scan Error',
        message: 'Could not read QR code format. Is this a valid event ticket?'
      });
    }
  };

  const closeScanner = () => {
    setIsScanning(false);
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-slate-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-slate-600" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-school-primary">Admin Access</h2>
            <p className="text-slate-500 text-sm mt-1">Authorized personnel only</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-school-primary/50"
                placeholder="Enter admin password"
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <button 
              type="submit"
              className="w-full bg-school-primary text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Login to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Sort: Pending first, then by date
  const sortedRegistrations = [...registrations].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
  });

  const filteredRegistrations = sortedRegistrations.filter(reg => 
    reg.student.fullName.toLowerCase().includes(filter.toLowerCase()) ||
    reg.student.mobile.includes(filter) ||
    reg.payment.transactionId?.toLowerCase().includes(filter.toLowerCase())
  );

  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const totalRevenue = registrations
    .filter(r => r.status === 'approved')
    .reduce((acc, curr) => acc + curr.payment.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in relative">
      
      {/* SCANNER MODAL */}
      {(isScanning || scanResult) && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold flex items-center">
                <QrCode className="w-5 h-5 mr-2" /> 
                {isScanning ? 'Scanning Ticket...' : 'Scan Result'}
              </h3>
              <button onClick={() => { closeScanner(); setScanResult(null); }} className="hover:bg-white/20 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {isScanning && (
                <div className="overflow-hidden rounded-xl bg-black">
                  <div id="reader" className="w-full"></div>
                </div>
              )}

              {scanResult && (
                <div className="text-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    scanResult.status === 'success' ? 'bg-green-100 text-green-600' :
                    scanResult.status === 'warning' ? 'bg-amber-100 text-amber-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {scanResult.status === 'success' ? <CheckCircle className="w-10 h-10" /> :
                     scanResult.status === 'warning' ? <AlertTriangle className="w-10 h-10" /> :
                     <XCircle className="w-10 h-10" />}
                  </div>
                  
                  <h4 className={`text-xl font-bold mb-2 ${
                    scanResult.status === 'success' ? 'text-green-700' :
                    scanResult.status === 'warning' ? 'text-amber-700' :
                    'text-red-700'
                  }`}>
                    {scanResult.title}
                  </h4>
                  
                  <p className="text-slate-600 mb-6">{scanResult.message}</p>

                  {scanResult.data && (
                    <div className="bg-slate-50 p-4 rounded-xl text-left text-sm border border-slate-200 mb-6">
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-slate-500">Name:</p>
                        <p className="font-bold text-slate-800">{scanResult.data.student.fullName}</p>
                        
                        <p className="text-slate-500">Ticket ID:</p>
                        <p className="font-mono text-slate-800">{scanResult.data.ticket.ticketId}</p>
                        
                        <p className="text-slate-500">Batch:</p>
                        <p className="font-bold text-slate-800">{scanResult.data.student.sscYear}</p>
                        
                        <p className="text-slate-500">Guests:</p>
                        <p className="font-bold text-slate-800">{scanResult.data.ticket.guests}</p>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => { setScanResult(null); setIsScanning(true); }}
                    className="w-full bg-school-primary text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors"
                  >
                    Scan Another
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-school-primary">Admin Dashboard</h2>
          <p className="text-slate-600">Manage registrations and verify payments.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setIsScanning(true)}
            className="bg-school-primary text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 flex items-center font-bold transform hover:-translate-y-0.5"
          >
            <QrCode className="w-5 h-5 mr-2" /> Scan Ticket
          </button>
          <div className="bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 text-amber-800">
            <span className="block text-xs font-bold uppercase">Pending</span>
            <span className="text-xl font-bold">{pendingCount}</span>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200 text-green-800">
            <span className="block text-xs font-bold uppercase">Revenue</span>
            <span className="text-xl font-bold">৳ {totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input 
          type="text"
          placeholder="Search by Name, Mobile, or TrxID..." 
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary/20"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Student Info</th>
                <th className="p-4 font-bold">Ticket</th>
                <th className="p-4 font-bold">Payment Info</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No registrations found.</td>
                </tr>
              ) : (
                filteredRegistrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                        reg.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        reg.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-start">
                        <div className="p-2 bg-slate-100 rounded-full mr-3">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{reg.student.fullName}</p>
                          <p className="text-xs text-slate-500 flex items-center mt-1">
                            <Smartphone className="w-3 h-3 mr-1" /> {reg.student.mobile}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center mt-0.5">
                            <Calendar className="w-3 h-3 mr-1" /> SSC {reg.student.sscYear}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-800 capitalize">{reg.ticket.type}</p>
                      <p className="text-xs text-slate-500">{reg.ticket.guests} Guest(s)</p>
                      <p className="text-xs font-mono text-slate-400 mt-1">{reg.ticket.ticketId}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-700 uppercase text-xs mb-1">{reg.payment.method}</p>
                      <p className="font-mono text-sm text-slate-600 bg-slate-100 inline-block px-2 py-0.5 rounded">
                        {reg.payment.transactionId || 'N/A'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">From: {reg.payment.senderNumber || 'N/A'}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-school-primary">৳ {reg.payment.total}</p>
                      {reg.payment.fee > 0 && (
                         <p className="text-[10px] text-slate-400">(inc. {reg.payment.fee} fee)</p>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {reg.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => onReject(reg.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => onApprove(reg.id)}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm font-bold shadow-sm"
                          >
                            <CheckCircle className="w-4 h-4 mr-1.5" /> Approve
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};