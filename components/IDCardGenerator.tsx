
import React, { useEffect, useState, useRef } from 'react';
import { StudentData, TicketData, NostalgiaContent } from '../types';
import { generateNostalgiaData } from '../services/geminiService';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Sparkles, History, Music, Film, User, Camera, ImagePlus, Loader } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface IDCardGeneratorProps {
  student: StudentData;
  ticket: TicketData;
  logo: string;
  // onLogoChange prop removed as logo is now fixed
}

export const IDCardGenerator: React.FC<IDCardGeneratorProps> = ({ student, ticket, logo }) => {
  const [nostalgia, setNostalgia] = useState<NostalgiaContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        scale: 4, // High quality
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
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
      const imgWidth = 80; // Physical width in mm (approx 3 inches)
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      // Add title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(30, 58, 138); // School Primary Color
      pdf.text("Dighali High School Reunion 2026", pdfWidth / 2, y - 15, { align: "center" });
      
      // Add card image
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      // Add footer instructions
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(100);
      pdf.text("Please bring this pass to the entry gate.", pdfWidth / 2, y + imgHeight + 8, { align: "center" });
      pdf.text(`Generated for: ${student.fullName}`, pdfWidth / 2, y + imgHeight + 13, { align: "center" });

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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
          #root > * {
            display: none;
          }
          #print-area-container {
            display: flex !important;
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            justify-content: center;
            align-items: flex-start;
            padding-top: 20px;
            z-index: 9999;
          }
          #print-area-container * {
            visibility: visible;
          }
          .no-print {
            display: none !important;
          }
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
      </div>

      {/* The Card Container - Resized to 300x600 */}
      <div id="print-area-container" className="flex flex-col items-center justify-center w-full">
        <div className="relative group">
          <div 
            id="id-card" 
            ref={cardRef}
            className="w-[300px] h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border print:border-slate-300 relative flex flex-col"
          >
            
            {/* Decorative holographic overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50 pointer-events-none z-10 print:hidden no-print"></div>

            {/* Header - Compact Layout (Horizontal) */}
            <div className="bg-school-primary h-24 relative overflow-hidden flex-shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-school-accent rounded-full opacity-30 blur-xl"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-400 rounded-full opacity-20 blur-xl"></div>

              <div className="flex flex-row items-center gap-3 relative z-10 px-4 w-full justify-center">
                {/* Logo - Smaller Size */}
                <div 
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-school-accent p-0.5 flex-shrink-0"
                >
                  <img src={logo} alt="School Logo" className="w-full h-full object-contain rounded-full" />
                </div>
                
                {/* Text - Left aligned next to logo */}
                <div className="text-left">
                    <h1 className="text-white font-serif font-bold text-sm leading-tight uppercase tracking-wide text-shadow-sm">Dighali<br/>High School</h1>
                    <div className="flex items-center mt-0.5">
                       <span className="h-[1px] w-2 bg-school-accent/50 mr-1"></span>
                       <p className="text-school-accent text-[9px] font-bold tracking-widest uppercase">Reunion 2026</p>
                    </div>
                </div>
              </div>
            </div>

            {/* Content - Padding Reduced */}
            <div className="p-3 flex-grow flex flex-col relative bg-white">
              {/* Badge */}
              <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-school-secondary text-white text-[8px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md border-2 border-white z-20 whitespace-nowrap">
                97 Years Celebration
              </div>

              {/* Photo Area - Reduced Size */}
              <div className="text-center mt-4 mb-2 relative z-30">
                <div 
                  className="w-24 h-24 mx-auto rounded-full border-[3px] border-white shadow-md mb-1.5 overflow-hidden flex items-center justify-center relative ring-1 ring-slate-100 bg-slate-100 group/photo cursor-pointer"
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
                    <User className="w-10 h-10 text-slate-300" />
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200 no-print">
                    <ImagePlus className="w-5 h-5 text-white mb-0.5" />
                    <span className="text-[7px] text-white font-bold uppercase tracking-wider">Upload</span>
                  </div>

                  {student.isVolunteer && (
                    <div className="absolute bottom-0 w-full bg-school-accent text-[7px] font-bold py-0.5 text-school-primary text-center uppercase z-20">
                      Volunteer
                    </div>
                  )}
                </div>

                <h2 className="text-lg font-bold text-slate-900 leading-tight uppercase tracking-tight line-clamp-1 px-1 mt-2">{student.fullName}</h2>
                <p className="text-school-primary font-medium text-xs mt-0.5 line-clamp-1 px-1">{student.occupation}</p>
              </div>

              {/* Details Grid - Compact spacing */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-xs bg-slate-50 rounded-lg p-3 border border-slate-100 mb-4 mt-2">
                <div>
                  <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">SSC Year</p>
                  <p className="font-bold text-slate-800 text-sm">{student.sscYear}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Pass Type</p>
                  <p className="font-bold text-school-secondary uppercase text-xs">{ticket.type}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Ticket ID</p>
                  <p className="font-mono text-slate-600 text-[10px] leading-tight">{ticket.ticketId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Guests</p>
                  <p className="font-bold text-slate-800 text-sm">{ticket.guests}</p>
                </div>
              </div>

              {/* QR Code - Optimized Size for 600px height */}
              <div className="mt-auto flex flex-col items-center justify-center pb-6">
                <div className="bg-white p-2 rounded-md border border-slate-200 shadow-sm">
                  <QRCodeSVG value={JSON.stringify({ id: ticket.ticketId, name: student.fullName, year: student.sscYear })} size={80} level="H" />
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-2 font-mono tracking-wide">Scan for Entry</p>
              </div>
            </div>
            
            {/* Footer Strip */}
            <div className="bg-slate-800 h-6 w-full flex items-center justify-center flex-shrink-0">
              <p className="text-[8px] text-slate-400 uppercase tracking-widest">Authorized Entry • 2026</p>
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
