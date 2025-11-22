
import React, { useState } from 'react';
import { TicketData, TShirtSize } from '../types';
import { Ticket, Users, User, Star, Gift, Utensils, Camera, Shirt, Check, X } from 'lucide-react';

interface TicketBookingProps {
  onSelect: (ticket: TicketData) => void;
}

interface PendingSelection {
  type: 'single' | 'couple' | 'family';
  price: number;
  guests: number;
}

export const TicketBooking: React.FC<TicketBookingProps> = ({ onSelect }) => {
  const [pendingSelection, setPendingSelection] = useState<PendingSelection | null>(null);
  const [sizes, setSizes] = useState<TShirtSize[]>([]);

  const initiateSelection = (type: 'single' | 'couple' | 'family', price: number, guests: number) => {
    setPendingSelection({ type, price, guests });
    // Initialize sizes array with 'L' as default for each guest
    setSizes(Array(guests).fill('L'));
  };

  const handleSizeChange = (index: number, size: TShirtSize) => {
    const newSizes = [...sizes];
    newSizes[index] = size;
    setSizes(newSizes);
  };

  const confirmSelection = () => {
    if (!pendingSelection) return;
    
    const ticketId = `DHS-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    onSelect({ 
      type: pendingSelection.type, 
      price: pendingSelection.price, 
      guests: pendingSelection.guests, 
      ticketId,
      tShirtSizes: sizes
    });
  };

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 relative">
      
      {/* Size Selection Modal */}
      {pendingSelection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
            <div className="bg-school-primary p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center text-lg">
                <Shirt className="w-5 h-5 mr-2 text-amber-400" /> Select T-Shirt Sizes
              </h3>
              <button onClick={() => setPendingSelection(null)} className="hover:bg-white/10 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-slate-600 mb-6 text-sm">
                Please select the T-Shirt size for each member included in the <strong>{pendingSelection.type}</strong> pass.
              </p>

              <div className="space-y-4 mb-8">
                {sizes.map((size, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700 text-sm">
                      {index === 0 ? 'Primary Member (You)' : `Guest Member #${index}`}
                    </span>
                    <div className="flex items-center gap-2">
                      {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSizeChange(index, s as TShirtSize)}
                          className={`w-8 h-8 rounded-md text-xs font-bold transition-colors border ${
                            size === s 
                              ? 'bg-school-primary text-white border-school-primary' 
                              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={confirmSelection}
                className="w-full bg-school-accent text-school-primary font-bold py-3 rounded-xl hover:bg-amber-400 transition-colors flex items-center justify-center shadow-lg"
              >
                Confirm & Proceed <Check className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Single Pass */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-blue-200 flex flex-col relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 group-hover:h-2 transition-all"></div>
          <div className="p-8 text-center border-b border-slate-50">
            <div className="inline-flex p-4 rounded-full bg-blue-50 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <User className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-800">Alumni Single</h3>
            <p className="text-sm text-slate-500 mt-1">For the solo traveler</p>
          </div>
          <div className="p-8 bg-slate-50/50 flex-grow">
            <div className="text-center mb-8">
               <span className="text-4xl font-bold text-school-primary">৳ 1,000</span>
            </div>
            <ul className="space-y-4 text-slate-600 text-sm mb-8">
              <li className="flex items-center"><div className="p-1 bg-green-100 rounded-full mr-3"><Star className="w-3 h-3 text-green-600" /></div> Entry for 1 Person</li>
              <li className="flex items-center"><div className="p-1 bg-green-100 rounded-full mr-3"><Utensils className="w-3 h-3 text-green-600" /></div> Lunch & Snacks</li>
              <li className="flex items-center"><div className="p-1 bg-green-100 rounded-full mr-3"><Gift className="w-3 h-3 text-green-600" /></div> Souvenir T-Shirt</li>
              <li className="flex items-center"><div className="p-1 bg-green-100 rounded-full mr-3"><Ticket className="w-3 h-3 text-green-600" /></div> Raffle Draw Entry</li>
            </ul>
            <button 
              onClick={() => initiateSelection('single', 1000, 1)}
              className="w-full bg-white border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white font-bold py-3 rounded-xl transition-all duration-200"
            >
              Select Single
            </button>
          </div>
        </div>

        {/* Couple Pass */}
        <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-school-accent relative transform md:-translate-y-4 md:hover:-translate-y-5 z-10 flex flex-col">
          <div className="absolute top-4 right-0 bg-school-accent text-school-primary text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-l shadow-md">Most Popular</div>
          <div className="p-8 text-center border-b border-slate-50 bg-gradient-to-b from-amber-50 to-white">
            <div className="inline-flex p-4 rounded-full bg-amber-100 text-amber-600 mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-800">Couple Pass</h3>
            <p className="text-sm text-slate-500 mt-1">Bring your partner</p>
          </div>
          <div className="p-8 bg-white flex-grow">
            <div className="text-center mb-8">
               <span className="text-5xl font-bold text-school-secondary">৳ 1,800</span>
               <span className="block text-xs text-amber-600 mt-1 font-medium">Save ৳ 200</span>
            </div>
            <ul className="space-y-4 text-slate-700 text-sm mb-8">
              <li className="flex items-center font-medium"><div className="p-1 bg-school-accent/30 rounded-full mr-3"><Star className="w-3 h-3 text-amber-700" /></div> Entry for 2 People</li>
              <li className="flex items-center"><div className="p-1 bg-school-accent/30 rounded-full mr-3"><Utensils className="w-3 h-3 text-amber-700" /></div> Lunch & Snacks (x2)</li>
              <li className="flex items-center"><div className="p-1 bg-school-accent/30 rounded-full mr-3"><Gift className="w-3 h-3 text-amber-700" /></div> Souvenir Gift Set</li>
              <li className="flex items-center"><div className="p-1 bg-school-accent/30 rounded-full mr-3"><Camera className="w-3 h-3 text-amber-700" /></div> Couple Photo Session</li>
            </ul>
            <button 
              onClick={() => initiateSelection('couple', 1800, 2)}
              className="w-full bg-school-secondary hover:bg-amber-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-900/20 transition-all duration-200"
            >
              Select Couple Pass
            </button>
          </div>
        </div>

        {/* Family Pass */}
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-blue-200 flex flex-col relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 group-hover:h-2 transition-all"></div>
          <div className="p-8 text-center border-b border-slate-50">
            <div className="inline-flex p-4 rounded-full bg-blue-50 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <Ticket className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-800">Family Pack</h3>
            <p className="text-sm text-slate-500 mt-1">Complete celebration</p>
          </div>
          <div className="p-8 bg-slate-50/50 flex-grow">
            <div className="text-center mb-8">
               <span className="text-4xl font-bold text-school-primary">৳ 3,000</span>
               <span className="block text-xs text-green-600 mt-1 font-medium">Best Value</span>
            </div>
            <ul className="space-y-4 text-slate-600 text-sm mb-8">
              <li className="flex items-center"><div className="p-1 bg-green-100 rounded-full mr-3"><Star className="w-3 h-3 text-green-600" /></div> Entry for 4 People</li>
              <li className="flex items-center"><div className="p-1 bg-green-100 rounded-full mr-3"><Utensils className="w-3 h-3 text-green-600" /></div> Premium Lunch Table</li>
              <li className="flex items-center"><div className="p-1 bg-green-100 rounded-full mr-3"><Gift className="w-3 h-3 text-green-600" /></div> Kids Zone Access</li>
              <li className="flex items-center"><div className="p-1 bg-green-100 rounded-full mr-3"><Camera className="w-3 h-3 text-green-600" /></div> Family Portrait</li>
            </ul>
            <button 
              onClick={() => initiateSelection('family', 3000, 4)}
              className="w-full bg-white border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white font-bold py-3 rounded-xl transition-all duration-200"
            >
              Select Family
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
