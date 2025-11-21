import React from 'react';
import { Clock, MapPin, Coffee, Music, Mic, Users, Sun } from 'lucide-react';

export const EventSchedule: React.FC = () => {
  const events = [
    { time: "08:00 AM", title: "Registration & Kit Collection", location: "Main Gate", icon: <Users className="w-5 h-5" />, color: "border-l-blue-500" },
    { time: "09:30 AM", title: "Grand Rally", location: "School Premises", icon: <Sun className="w-5 h-5" />, color: "border-l-amber-500" },
    { time: "11:00 AM", title: "Inauguration Ceremony", location: "Auditorium", icon: <Mic className="w-5 h-5" />, color: "border-l-green-500" },
    { time: "01:00 PM", title: "Grand Lunch", location: "Dining Hall", icon: <Coffee className="w-5 h-5" />, color: "border-l-red-500" },
    { time: "03:00 PM", title: "Nostalgia Session", location: "Classrooms", icon: <Users className="w-5 h-5" />, color: "border-l-purple-500" },
    { time: "05:00 PM", title: "Cultural Evening", location: "Main Stage", icon: <Music className="w-5 h-5" />, color: "border-l-pink-500" },
    { time: "08:00 PM", title: "Raffle Draw & Closing", location: "Main Stage", icon: <Mic className="w-5 h-5" />, color: "border-l-indigo-500" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-12">
        <span className="bg-blue-100 text-school-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">2 Days after Eid-ul-Fitr, 2026</span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-school-primary mb-4">Event Schedule</h2>
        <p className="text-slate-600 max-w-xl mx-auto text-lg">Join us for a day filled with joy, laughter, and cherished memories. Here is what we have planned for you.</p>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -ml-[1px]"></div>

        <div className="space-y-8">
          {events.map((event, index) => (
            <div key={index} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Timeline Dot */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-white border-4 border-school-secondary transform -translate-x-1/2 z-10 shadow-sm"></div>

              {/* Content Card */}
              <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-10' : 'md:pr-10'}`}>
                <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4 ${event.color} group`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-school-primary font-bold">
                      <Clock className="w-4 h-4 mr-2 text-slate-400" />
                      {event.time}
                    </div>
                    <div className="text-slate-400 group-hover:text-school-secondary transition-colors">
                      {event.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h3>
                  <div className="flex items-center text-slate-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {event.location}
                  </div>
                </div>
              </div>

              {/* Empty Space for layout balance */}
              <div className="hidden md:block md:w-1/2"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center bg-blue-50 p-8 rounded-2xl border border-blue-100">
        <h3 className="text-xl font-bold text-school-primary mb-2">Need Assistance?</h3>
        <p className="text-slate-600 mb-4">Our volunteer team will be available throughout the campus to guide you.</p>
        <a href="tel:+8801700000000" className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-school-primary hover:bg-blue-800 transition-colors">
          Contact Support
        </a>
      </div>
    </div>
  );
};