import React, { useState, useEffect } from 'react';
import { TicketData, PaymentMethod, PaymentDetails } from '../types';
import { CreditCard, Banknote, ArrowRight, Smartphone, Building, Wallet, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface PaymentGatewayProps {
  ticket: TicketData;
  onConfirm: (details: PaymentDetails) => void;
  onBack: () => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ ticket, onConfirm, onBack }) => {
  const [method, setMethod] = useState<PaymentMethod>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fee, setFee] = useState(0);
  const [total, setTotal] = useState(ticket.price);

  // Calculate fees whenever method or price changes
  useEffect(() => {
    let calculatedFee = 0;
    if (['bkash', 'nagad', 'rocket'].includes(method)) {
      // 1.8% cashout charge for MFS
      calculatedFee = Math.round(ticket.price * 0.018);
    } else {
      calculatedFee = 0;
    }
    setFee(calculatedFee);
    setTotal(ticket.price + calculatedFee);
  }, [method, ticket.price]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network request
    setTimeout(() => {
      onConfirm({
        method,
        amount: ticket.price,
        fee,
        total,
        transactionId: method === 'cash' ? 'CASH-ON-SPOT' : transactionId,
        senderNumber: method === 'cash' ? 'N/A' : senderNumber,
        timestamp: new Date().toISOString()
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const getMethodColor = (m: PaymentMethod) => {
    switch (m) {
      case 'bkash': return 'bg-pink-600 border-pink-600 text-white';
      case 'nagad': return 'bg-orange-600 border-orange-600 text-white';
      case 'rocket': return 'bg-purple-600 border-purple-600 text-white';
      case 'bank': return 'bg-blue-700 border-blue-700 text-white';
      case 'cash': return 'bg-green-600 border-green-600 text-white';
      default: return 'bg-slate-100 border-slate-200 text-slate-600';
    }
  };

  const getMethodLabel = (m: PaymentMethod) => {
    switch (m) {
      case 'bkash': return 'bKash';
      case 'nagad': return 'Nagad';
      case 'rocket': return 'Rocket';
      case 'bank': return 'Bank Transfer';
      case 'cash': return 'Cash Payment';
      default: return m;
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 animate-fade-in">
      <button 
        onClick={onBack}
        className="mb-6 text-slate-500 hover:text-school-primary flex items-center text-sm font-medium transition-colors"
      >
        <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Back to Ticket Selection
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="md:col-span-1 order-2 md:order-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-school-secondary" /> Order Summary
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                <span className="text-slate-500">Ticket Type</span>
                <span className="font-bold text-school-primary capitalize">{ticket.type} Pass</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                <span className="text-slate-500">Guests</span>
                <span className="font-bold text-slate-800">{ticket.guests} Person(s)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold text-slate-800">৳ {ticket.price}</span>
              </div>
              
              {fee > 0 && (
                <div className="flex justify-between items-center text-amber-600 bg-amber-50 p-2 rounded-md">
                  <span className="flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Gateway Fee (1.8%)</span>
                  <span className="font-bold">+ ৳ {fee}</span>
                </div>
              )}
              
              <div className="pt-4 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
                <span className="text-base font-bold text-slate-800">Total Payable</span>
                <span className="text-2xl font-bold text-school-primary">৳ {total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method & Form */}
        <div className="md:col-span-2 order-1 md:order-2">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
              <h2 className="text-2xl font-serif font-bold text-slate-800">Select Payment Method</h2>
              <p className="text-slate-500 text-sm mt-1">Secure payment gateway for Reunion 2026</p>
            </div>

            <div className="p-8">
              {/* Method Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-8">
                {(['bkash', 'nagad', 'rocket', 'bank', 'cash'] as PaymentMethod[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                      method === m 
                        ? getMethodColor(m) + ' shadow-md scale-105' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {m === 'bank' ? <Building className="w-6 h-6 mb-2" /> : 
                     m === 'cash' ? <Banknote className="w-6 h-6 mb-2" /> : 
                     <Smartphone className="w-6 h-6 mb-2" />}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{getMethodLabel(m)}</span>
                  </button>
                ))}
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-xl p-4 mb-8 border border-blue-100">
                <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" /> Payment Instructions
                </h4>
                {method === 'cash' ? (
                  <p className="text-sm text-blue-800">
                    Please visit the <strong>Dighali High School Office</strong> or contact a volunteer to pay in cash. 
                    Your registration will be pending until a volunteer verifies your cash payment.
                  </p>
                ) : method === 'bank' ? (
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>Bank: <strong>Sonali Bank PLC</strong></p>
                    <p>Account Name: <strong>Dighali High School Reunion Fund</strong></p>
                    <p>Account No: <strong>3400882910</strong></p>
                    <p>Branch: <strong>Dighali Branch</strong></p>
                  </div>
                ) : (
                  <div className="text-sm text-blue-800">
                    <p className="mb-1">1. Go to your {getMethodLabel(method)} App.</p>
                    <p className="mb-1">2. Select <strong>"Send Money"</strong>.</p>
                    <p className="mb-1">3. Enter Number: <strong className="font-mono text-lg select-all">01700000000</strong></p>
                    <p className="mb-1">4. Amount: <strong>৳ {total}</strong> (Reference: Your Name)</p>
                    <p>5. Enter the TrxID below.</p>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {method !== 'cash' && (
                  <>
                    <div className="group">
                      <label className="block">
                        <span className="text-slate-600 text-sm font-bold mb-1.5 block">Sender Number / Account No</span>
                        <input 
                          type="text" 
                          required
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary/20 focus:border-school-primary transition-all text-gray-900 placeholder-slate-300 bg-slate-50 focus:bg-white font-mono"
                          placeholder="01XXXXXXXXX"
                          value={senderNumber}
                          onChange={(e) => setSenderNumber(e.target.value)}
                        />
                      </label>
                    </div>

                    <div className="group">
                      <label className="block">
                        <span className="text-slate-600 text-sm font-bold mb-1.5 block">Transaction ID (TrxID)</span>
                        <input 
                          type="text" 
                          required
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary/20 focus:border-school-primary transition-all text-gray-900 placeholder-slate-300 bg-slate-50 focus:bg-white font-mono uppercase"
                          placeholder="8N7A6D5..."
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                        />
                      </label>
                    </div>
                  </>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center text-white ${
                    isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-school-primary hover:bg-blue-800 transform hover:-translate-y-1'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin w-5 h-5 mr-2" /> Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" /> Submit for Verification
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};