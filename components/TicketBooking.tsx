
import React from 'react';
import { TicketData } from '../types';
import { Ticket, Users, User, Star, Gift, Utensils, Camera } from 'lucide-react';

interface TicketBookingProps {
  onSelect: (ticket: TicketData) => void;
}

export const TicketBooking: React.FC<TicketBookingProps> = ({ onSelect }) => {
  const handleSelect = (type: 'single' | 'couple' | 'family', price: number, guests: number) => {
    const ticketId = `DHS-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    onSelect({ type, price, guests, ticketId });
  };

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
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
              onClick={() => handleSelect('single', 1000, 1)}
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
              onClick={() => handleSelect('couple', 1800, 2)}
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
              onClick={() => handleSelect('family', 3000, 4)}
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
