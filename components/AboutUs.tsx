
import React from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const AboutUs: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in font-sans">
      <div className="text-center mb-12">
        <span className="bg-blue-100 text-school-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">{t('since_1929')}</span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-school-primary mb-4">{t('our_heritage_title')}</h2>
        <div className="w-24 h-1 bg-school-accent mx-auto rounded-full"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="relative h-48 bg-school-primary flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px'}}></div>
          <BookOpen className="w-24 h-24 text-white opacity-20 absolute transform -rotate-12" />
          <div className="relative z-10 text-center p-6">
             <h3 className="text-2xl font-serif font-bold text-white text-shadow">{t('school_name')}</h3>
             <p className="text-blue-200 mt-2">{t('school_location')}</p>
          </div>
        </div>

        <div className="p-8 md:p-12">
           <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed text-justify font-serif">
              <p className="mb-6 first-letter:text-5xl first-letter:font-bold first-letter:text-school-primary first-letter:mr-3 first-letter:float-left">
                {t('history_p1')}
              </p>
              
              <div className="my-8 p-6 bg-blue-50 border-l-4 border-school-secondary rounded-r-xl italic text-school-primary">
                {t('history_quote')}
              </div>

              <p className="mb-6">
                {t('history_p2')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
                    <GraduationCap className="w-5 h-5 text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{t('recognition_title')}</h4>
                    <p className="text-sm">{t('recognition_desc')}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-start">
                  <div className="bg-amber-100 p-2 rounded-full mr-3 mt-1">
                    <BookOpen className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{t('co_curricular_title')}</h4>
                    <p className="text-sm">{t('co_curricular_desc')}</p>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
