
import React from 'react';
import { Minister } from '../types';

interface CharacterTabProps {
  ministers: Minister[];
}

const CharacterTab: React.FC<CharacterTabProps> = ({ ministers }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white border-4 border-black p-12 relative shadow-xl">
        <h2 className="cinzel text-5xl font-black mb-12 border-b-8 border-black pb-4 uppercase tracking-tighter">The Ministerial Ledger</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {ministers.map(m => (
            <div key={m.id} className={`flex items-start space-x-6 pb-8 border-b border-zinc-200 ${m.isResigned ? 'grayscale opacity-50' : ''}`}>
              <div className="shrink-0 relative">
                <img src={m.portrait} alt={m.name} className="w-28 h-28 object-cover border-4 border-black grayscale" />
                {m.isResigned && (
                  <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center">
                    <span className="bg-white text-red-900 text-[10px] font-black px-2 py-1 rotate-[-20deg] border-2 border-red-900">RESIGNED</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-3xl font-bold font-serif italic">{m.name}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-zinc-100 px-2 py-1">{m.personality}</span>
                </div>
                
                <p className="text-sm italic leading-tight text-zinc-600">"{m.bio}"</p>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-4">
                  <StatBar label="Happiness" value={m.happiness} color={m.happiness < 30 ? 'bg-red-800' : 'bg-green-800'} />
                  <StatBar label="Loyalty" value={m.loyalty} color="bg-zinc-800" />
                  <div className="col-span-2">
                    <span className="text-[10px] font-black uppercase opacity-40">Obsession:</span>
                    <span className="ml-2 text-xs font-serif font-bold italic">{m.goal}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatBar: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      <span className="text-[9px] font-bold">{value}%</span>
    </div>
    <div className="w-full bg-zinc-100 h-1 border border-zinc-300">
      <div className={`${color} h-full transition-all duration-1000`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default CharacterTab;
