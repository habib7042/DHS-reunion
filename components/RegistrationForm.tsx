import React, { useState } from 'react';
import { StudentData } from '../types';
import { User, Calendar, Phone, Mail, Briefcase, MapPin, CheckCircle, GraduationCap, CheckSquare } from 'lucide-react';

interface RegistrationFormProps {
  onSubmit: (data: StudentData) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<StudentData>({
    fullName: '',
    sscYear: 2000,
    mobile: '',
    email: '',
    occupation: '',
    presentAddress: '',
    permanentAddress: '',
    isVolunteer: false
  });

  const [isSameAddress, setIsSameAddress] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      // Auto-sync address if "Same as present" is checked and user is editing present address
      if (isSameAddress && name === 'presentAddress') {
        newData.permanentAddress = value;
      }

      return newData;
    });
  };

  const handleSameAddressToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsSameAddress(checked);
    if (checked) {
      setFormData(prev => ({ ...prev, permanentAddress: prev.presentAddress }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Update to calculate 96 years back from 2026
  const years = Array.from({ length: 96 }, (_, i) => 2026 - i); 

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden my-4 border border-slate-100 transform transition-all">
      <div className="bg-gradient-to-r from-school-primary to-blue-900 px-8 py-6 border-b border-blue-800/50">
        <h2 className="text-2xl font-serif font-bold text-white flex items-center">
          <div className="bg-white/10 p-2 rounded-lg mr-3">
             <User className="h-6 w-6 text-school-accent" />
          </div>
          Personal Information
        </h2>
        <p className="text-blue-200 mt-2 text-sm ml-14">We will print these details on your ID card.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center">
              <User className="w-4 h-4 mr-2 text-school-secondary" /> Basic Details
            </h3>
            
            <div className="group">
              <label className="block">
                <span className="text-slate-600 text-sm font-bold mb-1.5 block group-focus-within:text-school-primary transition-colors">Full Name</span>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-school-primary transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    name="fullName"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary/20 focus:border-school-primary transition-all text-gray-900 placeholder-slate-300 bg-slate-50 focus:bg-white"
                    placeholder="Ex: Md. Rahim Uddin"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
              </label>
            </div>

            <div className="group">
              <label className="block">
                <span className="text-slate-600 text-sm font-bold mb-1.5 block group-focus-within:text-school-primary transition-colors">SSC Year</span>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <GraduationCap className="h-5 w-5 text-slate-400 group-focus-within:text-school-primary transition-colors" />
                  </div>
                  <select 
                    name="sscYear"
                    required
                    className="w-full pl-11 pr-10 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary/20 focus:border-school-primary bg-slate-50 focus:bg-white text-gray-900 appearance-none cursor-pointer"
                    value={formData.sscYear}
                    onChange={handleChange}
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                  </div>
                </div>
              </label>
            </div>

            <div className="group">
              <label className="block">
                <span className="text-slate-600 text-sm font-bold mb-1.5 block group-focus-within:text-school-primary transition-colors">Mobile Number</span>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-school-primary transition-colors" />
                  </div>
                  <input 
                    type="tel" 
                    name="mobile"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary/20 focus:border-school-primary transition-all text-gray-900 placeholder-slate-300 bg-slate-50 focus:bg-white"
                    placeholder="017XXXXXXXX"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>
              </label>
            </div>

            <div className="group">
              <label className="block">
                <span className="text-slate-600 text-sm font-bold mb-1.5 block group-focus-within:text-school-primary transition-colors">Email (Optional)</span>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-school-primary transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary/20 focus:border-school-primary transition-all text-gray-900 placeholder-slate-300 bg-slate-50 focus:bg-white"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Address & Occupation */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center">
               <Briefcase className="w-4 h-4 mr-2 text-school-secondary" /> Professional & Address
            </h3>

            <div className="group">
              <label className="block">
                <span className="text-slate-600 text-sm font-bold mb-1.5 block group-focus-within:text-school-primary transition-colors">Current Occupation</span>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-slate-400 group-focus-within:text-school-primary transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    name="occupation"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary/20 focus:border-school-primary transition-all text-gray-900 placeholder-slate-300 bg-slate-50 focus:bg-white"
                    placeholder="Job Title / Business / Student"
                    value={formData.occupation}
                    onChange={handleChange}
                  />
                </div>
              </label>
            </div>

            <div className="group">
              <label className="block">
                <span className="text-slate-600 text-sm font-bold mb-1.5 block group-focus-within:text-school-primary transition-colors">Present Address</span>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-school-primary transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    name="presentAddress"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary/20 focus:border-school-primary transition-all text-gray-900 placeholder-slate-300 bg-slate-50 focus:bg-white"
                    placeholder="City, Area, Road No"
                    value={formData.presentAddress}
                    onChange={handleChange}
                  />
                </div>
              </label>
            </div>

            <div className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-600 text-sm font-bold block group-focus-within:text-school-primary transition-colors">Permanent Address</span>
                
                <label className="flex items-center cursor-pointer bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors">
                  <input 
                    type="checkbox"
                    checked={isSameAddress}
                    onChange={handleSameAddressToggle}
                    className="rounded border-gray-300 text-school-primary focus:ring-school-primary/20 w-3 h-3"
                  />
                  <span className="ml-1.5 text-xs text-slate-600 font-medium select-none">Same as Present</span>
                </label>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-school-primary transition-colors" />
                </div>
                <input 
                  type="text" 
                  name="permanentAddress"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-school-primary/20 focus:border-school-primary transition-all text-gray-900 placeholder-slate-300 bg-slate-50 focus:bg-white"
                  placeholder="Village, District"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-4">
              <label className={`flex items-center space-x-4 p-5 border rounded-xl cursor-pointer transition-all duration-200 ${formData.isVolunteer ? 'bg-amber-50 border-amber-200 ring-1 ring-amber-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                <div className="relative flex items-center">
                  <input 
                    type="checkbox"
                    name="isVolunteer"
                    checked={formData.isVolunteer}
                    onChange={handleChange}
                    className="peer h-6 w-6 text-school-primary rounded focus:ring-school-primary border-gray-300 cursor-pointer"
                  />
                </div>
                <div>
                  <span className={`block font-bold ${formData.isVolunteer ? 'text-amber-900' : 'text-slate-700'}`}>I want to be a Volunteer</span>
                  <p className={`text-xs ${formData.isVolunteer ? 'text-amber-700' : 'text-slate-500'}`}>Join the organizing team and help make this event a success!</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex justify-end">
          <button 
            type="submit"
            className="bg-school-primary hover:bg-blue-800 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-blue-900/20 transform transition hover:-translate-y-1 hover:shadow-xl flex items-center text-lg"
          >
            Proceed to Booking <CheckCircle className="ml-2 h-6 w-6" />
          </button>
        </div>
      </form>
    </div>
  );
};