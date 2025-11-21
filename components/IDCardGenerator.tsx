
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
}

export const IDCardGenerator: React.FC<IDCardGeneratorProps> = ({ student, ticket, logo }) => {
  const [nostalgia, setNostalgia] = useState<NostalgiaContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Safety check to prevent crashes if data is missing
  if (!student || !ticket) {
    return <div className="p-8 text-center">Error: Missing registration data. Please try checking your status again.</div>;
  }

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
      
      // 1. Scroll to top to ensure element is in view/renderable (helps some browsers)
      window.scrollTo(0, 0);

      // 2. Small delay to ensure DOM is stable
      await new Promise(resolve => setTimeout(resolve, 300));

      // 3. Capture with html2canvas
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Good balance of quality vs file size
        useCORS: true, // Needed for external images
        backgroundColor: '#ffffff', // Force white background to avoid transparency issues
        logging: false,
        allowTaint: true,
        ignoreElements: (element) => {
          if (!element || !element.classList) return false;
          return element.classList.contains('no-print');
        }
      });

      // 4. Generate PDF
      const imgData = canvas.toDataURL('image/png'); // PNG is safer than JPEG for text clarity
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to fit on A4 while maintaining aspect ratio
      const canvasRatio = canvas.height / canvas.width;
      const imgWidth = 100; // 100mm width (approx 378px)
      const imgHeight = imgWidth * canvasRatio;
      
      const x = (pdfWidth - imgWidth) / 2;
      const y = 20; // Top margin

      // Add title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(30, 58, 138); // School Primary Color
      pdf.text("Dighali High School Reunion 2026", pdfWidth / 2, 15, { align: "center" });
      
      // Add the card image
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      // Add footer instructions
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text("Please print this card and bring it to the venue.", pdfWidth / 2, y + imgHeight + 10, { align: "center" });
      
      // Save
      pdf.save(`DHS_Card_${student.sscYear}_${student.fullName.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Could not generate PDF automatically. Please use the 'Print Badge' button and select 'Save as PDF' as the destination.");
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
            height: auto !important;
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
        <p className="text-slate-600 max-w-md mx-auto mb-4">Upload your photo to complete your entry badge.</p>
        
        {!photo && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 max-w-sm mx-auto mb-6 flex items-center animate-pulse cursor-pointer hover:bg-amber-100 transition-colors shadow-sm" onClick={triggerFileInput}>
             <Camera className="w-5 h-5 text-amber-600 mr-2" />
             <span className="text-sm text-amber-800 font-bold">Click avatar to upload photo</span>
          </div>
        )}
        
        <div className="flex flex-wrap justify-center gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center px-6 py-3 bg-school-primary text-white rounded-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 font-medium transform hover:-translate-y-0.5"
          >
            <Printer className="w-4 h-4 mr-2" /> Print Badge
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
            {downloading ? 'Generating...' : 'Save as PDF'}
          </button>
        </div>
      </div>

      {/* The Card Container - Vertical Event Badge (Width 400px, Auto Height) */}
      <div id="print-area-container" className="flex flex-col items-center justify-center w-full">
        <div className="relative group drop-shadow-2xl">
          <div 
            id="id-card" 
            ref={cardRef}
            className="w-[400px] min-h-[600px] h-auto bg-white rounded-xl overflow-hidden border-0 relative flex flex-col pb-8"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)', backgroundSize: '12px 12px'}}></div>
            
            {/* Top Decorative Stripe */}
            <div className="h-2 w-full bg-gradient-to-r from-school-primary via-school-accent to-school-primary shrink-0"></div>

            {/* Header */}
            <div className="pt-6 pb-2 text-center relative z-10 shrink-0">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 mb-2 bg-white rounded-full p-0.5 border border-slate-100 shadow-sm">
                   <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-school-primary font-serif font-bold text-xl leading-tight">DIGHALI HIGH SCHOOL</h1>
                <div className="flex items-center gap-2 mt-1">
                   <div className="h-[1px] w-6 bg-school-accent"></div>
                   <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Est. 1929</span>
                   <div className="h-[1px] w-6 bg-school-accent"></div>
                </div>
              </div>
            </div>

            {/* Main Badge Content */}
            <div className="flex-grow flex flex-col items-center px-6 pt-2 pb-6 relative z-10">
              
              {/* Event Title Badge */}
              <div className="mb-5 bg-gradient-to-r from-school-primary to-blue-800 text-white px-4 py-1.5 rounded-full shadow-md shrink-0">
                 <span className="text-[10px] font-bold uppercase tracking-widest">Reunion 2026</span>
              </div>

              {/* Photo with Ring */}
              <div 
                 className="w-36 h-36 rounded-full p-1 bg-white border-2 border-school-accent/50 shadow-lg mb-5 cursor-pointer group/photo relative shrink-0"
                 onClick={triggerFileInput}
              >
                 <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                 <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 relative">
                    {photo ? (
                      <img src={photo} alt="Student" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                         <User className="w-14 h-14 text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity no-print">
                       <ImagePlus className="w-6 h-6 text-white" />
                    </div>
                 </div>
                 {/* Volunteer Tag */}
                 {student.isVolunteer && (
                   <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-school-accent text-school-primary text-[10px] font-bold px-3 py-0.5 rounded border border-white uppercase">
                     Volunteer
                   </div>
                 )}
              </div>

              {/* Name & Title */}
              <div className="text-center w-full mb-6">
                <h2 className="text-2xl font-bold text-slate-900 uppercase leading-tight break-words font-serif">{student.fullName}</h2>
                <p className="text-school-secondary text-sm font-bold mt-1 uppercase tracking-wide">{student.occupation}</p>
              </div>

              {/* Info Grid */}
              <div className="w-full grid grid-cols-2 gap-3 text-center border-t border-b border-slate-100 py-4 mb-auto shrink-0">
                <div>
                   <span className="block text-[10px] text-slate-400 font-bold uppercase">Batch</span>
                   <span className="block text-2xl font-bold text-school-primary">{student.sscYear}</span>
                </div>
                <div className="border-l border-slate-100">
                   <span className="block text-[10px] text-slate-400 font-bold uppercase">Guests</span>
                   <span className="block text-2xl font-bold text-school-primary">{ticket.guests}</span>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="pt-6 flex flex-col items-center shrink-0">
                 <div className="bg-white p-2 border border-slate-200 rounded shadow-sm">
                    <QRCodeSVG value={JSON.stringify({ id: ticket.ticketId, name: student.fullName, year: student.sscYear })} size={120} level="M" />
                 </div>
                 <p className="text-[10px] font-mono text-slate-400 mt-2">{ticket.ticketId}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-900 text-center py-3 mt-auto shrink-0 absolute bottom-0 w-full left-0">
              <p className="text-[10px] text-school-accent font-bold uppercase tracking-widest">Authorized Entry • 97 Years</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Nostalgia Section */}
      <div className="mt-10 w-full max-w-[600px] no-print animate-fade-in-up">
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
