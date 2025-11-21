
import React, { useEffect, useState } from 'react';
import { Memory } from '../types';
import { memoryService } from '../services/api';
import { Quote, Calendar } from 'lucide-react';
import { ShareMemory } from './ShareMemory';

interface MemoryWallProps {
  preVerifiedStudent?: { fullName: string; sscYear: number };
}

export const MemoryWall: React.FC<MemoryWallProps> = ({ preVerifiedStudent }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showForm, setShowForm] = useState(false);

  const loadMemories = async () => {
    const data = await memoryService.getAll();
    setMemories(data);
  };

  useEffect(() => {
    loadMemories();
    if (preVerifiedStudent) {
      // Optionally auto-open form if user is verified contextually, 
      // but keeping it closed initially is cleaner UI, user can click "Share"
    }
  }, [preVerifiedStudent]);

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10">
        <div className="mb-6 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-school-primary mb-2">Alumni Memories</h2>
          <p className="text-slate-600">Heartwarming moments shared by verified alumni.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-school-accent text-school-primary px-6 py-2 rounded-full font-bold shadow-lg hover:bg-white transition-all"
        >
          {showForm ? 'Close Form' : '+ Share Your Memory'}
        </button>
      </div>

      {showForm && (
        <div className="max-w-md mx-auto mb-12 animate-fade-in-down">
          <ShareMemory 
            onSuccess={() => { setShowForm(false); loadMemories(); }} 
            preVerifiedStudent={preVerifiedStudent}
          />
        </div>
      )}

      {memories.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500">No memories shared yet. Be the first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {memories.map((mem) => (
            <div key={mem.id || Math.random()} className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-xl transition-shadow flex flex-col relative group">
              <Quote className="w-8 h-8 text-blue-100 absolute top-4 right-4 group-hover:text-blue-200 transition-colors" />
              <p className="text-slate-700 italic mb-6 leading-relaxed relative z-10 font-serif text-lg">
                "{mem.text}"
              </p>
              <div className="mt-auto flex items-center pt-4 border-t border-slate-50">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {mem.studentName.charAt(0)}
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-slate-900 text-sm">{mem.studentName}</h4>
                  <p className="text-xs text-slate-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" /> Batch {mem.sscYear}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
