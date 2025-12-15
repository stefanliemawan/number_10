
import React from 'react';
import { Stats } from '../types';

interface MediaTabProps {
  stats: Stats;
}

const MediaTab: React.FC<MediaTabProps> = ({ stats }) => {
  const getHeadline = (perception: number) => {
    if (perception > 75) return "PRIME MINISTER TRIUMPHANT: A GOLDEN ERA BEGINS";
    if (perception > 50) return "Government Holds Steady Amidst Global Headwinds";
    if (perception > 30) return "Chaos in Cabinet: Number 10 Struggles to Lead";
    return "NATIONAL DISGRACE: RESIGNATION CALLS INTENSIFY";
  };

  const stories = [
    { source: "The Times", text: "Senior sources suggest the PM is eyeing a radical shift in energy policy." },
    { source: "The Daily Mail", text: "OUR READERS DEMAND ACTION: Why isn't the Chancellor doing more?" },
    { source: "The Guardian", text: "Disquiet in the North as budget cuts threaten local services." },
    { source: "BBC News", text: "Breaking: MI5 warning suggests increased risks to national security." }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700 max-w-4xl mx-auto">
      <div className="bg-white p-12 border-2 border-[#2c2c2c] shadow-2xl rotate-1">
        <div className="text-center border-b-4 border-double border-[#2c2c2c] pb-6 mb-8">
            <h1 className="cinzel text-6xl font-black uppercase tracking-tighter">THE GAZETTE</h1>
            <p className="text-xs uppercase tracking-widest mt-2 font-bold">ESTABLISHED 1785 • LONDON EDITION</p>
        </div>
        
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-4xl font-black uppercase leading-none tracking-tighter mb-4">
              {getHeadline(stats.mediaPerception)}
            </h2>
            <p className="text-lg italic font-serif text-slate-700">Analysis by our Political Correspondent</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#2c2c2c]/20">
            {stories.map((s, i) => (
              <div key={i} className="space-y-2">
                <span className="font-bold text-xs uppercase underline">{s.source}</span>
                <p className="text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#2c2c2c] text-white p-4 text-center mt-8">
            <span className="cinzel text-xs font-bold">Current Media Favorability: {stats.mediaPerception}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaTab;
