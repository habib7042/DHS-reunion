import React from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-12">
        <span className="bg-blue-100 text-school-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Since 1929</span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-school-primary mb-4">Our Heritage</h2>
        <div className="w-24 h-1 bg-school-accent mx-auto rounded-full"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="relative h-48 bg-school-primary flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px'}}></div>
          <BookOpen className="w-24 h-24 text-white opacity-20 absolute transform -rotate-12" />
          <div className="relative z-10 text-center p-6">
             <h3 className="text-2xl font-serif font-bold text-white text-shadow">দিঘলী উচ্চ বিদ্যালয়</h3>
             <p className="text-blue-200 mt-2">লক্ষ্মীপুর সদর</p>
          </div>
        </div>

        <div className="p-8 md:p-12">
           <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed text-justify font-serif">
              <p className="mb-6 first-letter:text-5xl first-letter:font-bold first-letter:text-school-primary first-letter:mr-3 first-letter:float-left">
                লক্ষ্মীপুর সদর উপজেলাধীন দিঘলী ইউনিয়নের কেন্দ্রবিন্দু দিঘলী বাজার সংলগ্ন প্রাচীর বেষ্টিত এক মনোরম প্রাকৃতিক দখিনা পরিবেশে দিঘলী উচ্চ বিদ্যালয়টি ১/১/১৯২৯ ই. সালে প্রতিষ্ঠিত।
              </p>
              
              <div className="my-8 p-6 bg-blue-50 border-l-4 border-school-secondary rounded-r-xl italic text-school-primary">
                "মানব হিতৈষী ও বিশিষ্ট শিক্ষানুরাগী মরহুম আলহাজ্ব আনছার উদ্দিন আহমেদ নদীগরবে বিলীন প্রায় বিদ্যালয়টিকে বর্তমান স্থানে প্রতিষ্ঠা করেন।"
              </div>

              <p className="mb-6">
                এলাকার দরিদ্র সাধারণের সন্তানদের মাঝে সুদীর্ঘ ৭৬ বছর যাবত শিক্ষার আলো ছড়িয়ে যাচ্ছে। যাদের মধ্যে অনেক ছাত্র-ছাত্রী সরকারী-বেসরকারী পর্যায়ে বড় বড় দায়িত্ব পালনের করছে এবং করেছে।
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
                    <GraduationCap className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">স্বীকৃতি ও ফলাফল</h4>
                    <p className="text-sm">প্রাপ্ত রেকড অনুযায়ী ০১/০১/১৯৫৯ ই. তারিখ হতে শিক্ষা বোর্ডের স্বীকৃতি লাভ করে। বিদ্যালয়ের অভ্যন্তরীণ ও পাবলিক পরীক্ষার ফলাফল যথেষ্ট ভাল।</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-3 mt-1">
                    <BookOpen className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">সহশিক্ষা কার্যক্রম</h4>
                    <p className="text-sm">সহপাঠক্রম ও প্রযুক্তিগত দিক থেকেও বিদ্যালয়টি এগিয়ে আছে।</p>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
