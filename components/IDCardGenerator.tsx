import React, { useEffect, useState, useRef } from 'react';
import { StudentData, TicketData, NostalgiaContent } from '../types';
import { generateNostalgiaData } from '../services/geminiService';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Sparkles, History, Music, Film, User, Camera, ImagePlus, Loader, Upload } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface IDCardGeneratorProps {
  student: StudentData;
  ticket: TicketData;
  logo: string;
  onLogoChange: (logo: string) => void;
}

export const IDCardGenerator: React.FC<IDCardGeneratorProps> = ({ student, ticket, logo, onLogoChange }) => {
  const [nostalgia, setNostalgia] = useState<NostalgiaContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (student.sscYear) {
        try {
          const data = await generateNostalgiaData(Number(student.sscYear));
          if (isMounted) {
            setNostalgia(data);
            setLoading(false);
          }
        } catch (error) {
          console.error("Failed to fetch nostalgia data", error);
          if (isMounted) setLoading(false);
        }
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [student.sscYear]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;

    try {
      setDownloading(true);
      
      // Wait a moment for any rendering to settle
      await new Promise(resolve => setTimeout(resolve, 200));

      const canvas = await html2canvas(cardRef.current, {
        scale: 4, // Higher scale for sharp text
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        // Safely check for classList to avoid crashing on text nodes
        ignoreElements: (element) => {
          if (!element || !element.classList) return false;
          return element.classList.contains('no-print');
        }
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth * 0.6; // 60% of page width for better visibility
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      // Add title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(30, 58, 138); // School Primary Color
      pdf.text("Dighali High School Reunion 2026", pdfWidth / 2, y - 15, { align: "center" });
      
      // Add card image
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      // Add footer instructions
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text("Please bring this pass to the entry gate.", pdfWidth / 2, y + imgHeight + 10, { align: "center" });
      pdf.text(`Generated for: ${student.fullName}`, pdfWidth / 2, y + imgHeight + 16, { align: "center" });

      pdf.save(`DHS_Reunion_Card_${student.sscYear}_${student.fullName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try printing instead.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhoto(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onLogoChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerLogoInput = () => {
    logoInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4 pb-20">
      {/* Print Specific Styles */}
      <style>{`
        @media print {
          body {
            visibility: hidden;
            background-color: white;
          }
          /* Hide everything by default */
          #root > * {
            display: none;
          }
          /* Only show the ID card container */
          #print-area-container {
            display: flex !important;
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }
          #print-area-container * {
            visibility: visible;
          }
          /* Hide non-printable elements explicitly */
          .no-print {
            display: none !important;
          }
          /* Force colors */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: auto;
            margin: 0;
          }
        }
      `}</style>

      <div className="mb-8 text-center no-print animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 shadow-sm">
          <Sparkles className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-school-primary mb-2">You're Registered!</h2>
        <p className="text-slate-600 max-w-md mx-auto mb-4">Please upload your photo below to complete your ID card.</p>
        
        {!photo && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 max-w-sm mx-auto mb-6 flex items-center animate-pulse cursor-pointer hover:bg-amber-100 transition-colors shadow-sm" onClick={triggerFileInput}>
             <Camera className="w-5 h-5 text-amber-600 mr-2" />
             <span className="text-sm text-amber-800 font-bold">Action Required: Click on the card avatar to upload photo</span>
          </div>
        )}
        
        <div className="flex flex-wrap justify-center gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center px-6 py-3 bg-school-primary text-white rounded-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 font-medium transform hover:-translate-y-0.5"
          >
            <Printer className="w-4 h-4 mr-2" /> Print Card
          </button>
          <button 
             onClick={handleDownloadPDF}
             disabled={downloading}
             className={`flex items-center px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium shadow-sm hover:shadow-md ${downloading ? 'opacity-75 cursor-wait' : ''}`}
          >
            {downloading ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {downloading ? 'Generating PDF...' : 'Save as PDF'}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-3">Tip: Click the School Logo on the card to upload your own.</p>
      </div>

      {/* The Card Container - Wrapped for Print Isolation */}
      <div id="print-area-container" className="flex flex-col items-center justify-center w-full">
        <div className="relative group">
          <div 
            id="id-card" 
            ref={cardRef}
            className="w-[350px] h-[580px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border print:border-slate-300 relative flex flex-col"
          >
            
            {/* Decorative holographic overlay effect (Visual only) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50 pointer-events-none z-10 print:hidden no-print"></div>

            {/* Header */}
            <div className="bg-school-primary h-40 relative overflow-hidden flex-shrink-0">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-school-accent rounded-full opacity-30 blur-2xl"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-2xl"></div>

              <div className="flex flex-col items-center justify-center h-full relative z-10 pt-1 pb-2">
                {/* Logo Container - Clickable for upload */}
                <div 
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-2 shadow-xl border-4 border-school-accent p-1 overflow-hidden relative group/logo cursor-pointer"
                  onClick={triggerLogoInput}
                  title="Click to change school logo"
                >
                  <input 
                    type="file" 
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <img src={logo} alt="School Logo" className="w-full h-full object-contain rounded-full" />

                  {/* Hover Overlay for Logo Upload */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity duration-200 no-print rounded-full">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Text below logo */}
                <h1 className="text-white font-serif font-bold text-lg tracking-wider uppercase text-shadow-sm">Dighali High School</h1>
                <div className="flex items-center space-x-2 mt-0.5">
                   <span className="h-[1px] w-6 bg-school-accent/50"></span>
                   <p className="text-school-accent text-[10px] font-bold tracking-[0.2em] uppercase">Reunion 2026</p>
                   <span className="h-[1px] w-6 bg-school-accent/50"></span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-grow flex flex-col relative bg-white">
              {/* Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-school-secondary text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md border-2 border-white z-20">
                97 Years Celebration
              </div>

              {/* Photo Area with Upload */}
              <div className="text-center mt-2 mb-4 relative z-30">
                <div 
                  className="w-28 h-28 mx-auto rounded-full border-4 border-white shadow-lg mb-3 overflow-hidden flex items-center justify-center relative ring-1 ring-slate-100 bg-slate-100 group/photo cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {photo ? (
                    <img src={photo} alt={student.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-300" />
                  )}
                  
                  {/* Hover Overlay for Upload (Hidden in Print/PDF) */}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200 no-print">
                    <ImagePlus className="w-6 h-6 text-white mb-1" />
                    <span className="text-[8px] text-white font-bold uppercase tracking-wider">Upload Photo</span>
                  </div>

                  {/* Volunteer indicator */}
                  {student.isVolunteer && (
                    <div className="absolute bottom-0 w-full bg-school-accent text-[8px] font-bold py-0.5 text-school-primary text-center uppercase z-20">
                      Volunteer
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-slate-900 leading-tight uppercase tracking-tight">{student.fullName}</h2>
                <p className="text-school-primary font-medium text-sm mt-1">{student.occupation}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm bg-slate-50 rounded-lg p-4 border border-slate-100 mb-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">SSC Year</p>
                  <p className="font-bold text-slate-800 text-base">{student.sscYear}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Pass Type</p>
                  <p className="font-bold text-school-secondary uppercase text-sm">{ticket.type}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Ticket ID</p>
                  <p className="font-mono text-slate-600 text-xs">{ticket.ticketId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Total Guests</p>
                  <p className="font-bold text-slate-800">{ticket.guests}</p>
                </div>
              </div>

              {/* QR Code */}
              <div className="mt-auto flex flex-col items-center justify-center">
                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                  <QRCodeSVG value={JSON.stringify({ id: ticket.ticketId, name: student.fullName, year: student.sscYear })} size={70} level="H" />
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-1 font-mono">Scan at Entry Gate</p>
              </div>
            </div>
            
            {/* Footer Strip */}
            <div className="bg-slate-800 h-8 w-full flex items-center justify-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Authorized Entry • 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Nostalgia Section */}
      <div className="mt-12 w-full max-w-[600px] no-print animate-fade-in-up">
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
          <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-lg text-indigo-900">Time Machine: {student.sscYear}</h3>
             </div>
             <span className="text-xs font-bold bg-white text-indigo-600 px-2 py-1 rounded border border-indigo-200">AI Generated</span>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="flex gap-4">
                   <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                   <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                   </div>
                </div>
                <div className="h-24 bg-slate-50 rounded-lg"></div>
              </div>
            ) : nostalgia ? (
               <div className="space-y-6">
                  <div className="relative pl-4 border-l-2 border-indigo-200">
                     <p className="text-sm text-slate-600 italic">"Do you remember this?"</p>
                     <p className="text-base text-slate-800 font-medium mt-1">{nostalgia.fact}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 shrink-0">
                          <Music className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-pink-400 uppercase tracking-wider">On The Radio</p>
                          <p className="text-sm text-pink-900 font-bold leading-tight">{nostalgia.song}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                           <Film className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">At The Movies</p>
                           <p className="text-sm text-amber-900 font-bold leading-tight">{nostalgia.movie}</p>
                        </div>
                     </div>
                  </div>
               </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p>Could not retrieve memory lane data.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};