
import React, { useState } from 'react';
import { RESPONSE_CARDS } from '../constants';
import { evaluatePMQ } from '../services/geminiService';

interface PMQSessionProps {
  onComplete: (score: number) => void;
}

const QUESTIONS = [
  "Does the Prime Minister agree that the current energy crisis is a direct result of government negligence?",
  "With the budget deficit rising, how can the PM justify the latest tax cuts for corporations?",
  "The House of Lords has rejected the new immigration bill. What is the PM's plan to bypass this blockage?",
  "Public services are crumbling. Will the PM admit their policy is failing?"
];

const PMQSession: React.FC<PMQSessionProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ score: number, commentary: string }[]>([]);
  const [feedback, setFeedback] = useState<{ score: number, commentary: string } | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleResponse = async (cardLabel: string) => {
    setLoading(true);
    try {
      const evaluation = await evaluatePMQ(QUESTIONS[currentQuestion], cardLabel);
      setFeedback(evaluation);
      const newResults = [...results, evaluation];
      setResults(newResults);
      
      setTimeout(() => {
        setFeedback(null);
        if (currentQuestion < QUESTIONS.length - 1) {
          setCurrentQuestion(prev => prev + 1);
        } else {
          setShowSummary(true);
        }
        setLoading(false);
      }, 2500);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getPerformanceText = (avg: number) => {
    if (avg >= 8) return "A masterclass in parliamentary debate. The opposition is in tatters.";
    if (avg >= 6) return "A solid performance. You held the line with dignity.";
    if (avg >= 4) return "A mediocre display. The backbenchers are grumbling.";
    return "A total disaster. The press is already sharpened their knives.";
  };

  const calculateFinalScore = () => {
    if (results.length === 0) return 0;
    return Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length);
  };

  if (showSummary) {
    const finalScore = calculateFinalScore();
    const performance = getPerformanceText(finalScore);
    const impact = (finalScore - 5) * 2.5;

    return (
      <div className="h-full flex flex-col items-center justify-center animate-in zoom-in duration-500">
        <div className="max-w-2xl w-full bg-white border-8 border-black p-12 shadow-2xl relative rotate-1">
          <div className="absolute -top-6 -right-6 wax-seal w-24 h-24 text-lg">FINAL</div>
          <h2 className="cinzel text-5xl font-black mb-6 text-center underline decoration-double">PMQ WRAP-UP</h2>
          
          <div className="space-y-8 py-6">
            <div className="text-center">
              <span className="text-[12px] font-black uppercase tracking-[0.4em] opacity-40">Overall Rating</span>
              <div className="text-8xl font-black cinzel mt-2">{finalScore}/10</div>
            </div>

            <div className="border-y-2 border-black/10 py-8 text-center px-4">
              <p className="text-2xl font-serif italic leading-snug">"{performance}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-4 border border-black/10">
                <span className="text-[10px] font-black uppercase opacity-50 block mb-1">Approval Impact</span>
                <span className={`text-xl font-bold ${impact >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                  {impact >= 0 ? '+' : ''}{impact.toFixed(1)}%
                </span>
              </div>
              <div className="bg-zinc-50 p-4 border border-black/10">
                <span className="text-[10px] font-black uppercase opacity-50 block mb-1">Media Outlook</span>
                <span className={`text-xl font-bold ${finalScore >= 5 ? 'text-green-800' : 'text-red-800'}`}>
                   {finalScore >= 5 ? 'Positive' : 'Critical'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onComplete(finalScore)}
              className="w-full bg-black text-white py-6 cinzel font-black text-xl hover:bg-zinc-900 transition-all uppercase tracking-widest shadow-[6px_6px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              Return to Number 10
            </button>
          </div>
        </div>
        <p className="mt-8 text-[11px] font-black uppercase opacity-30 cinzel tracking-[0.5em]">End of Hansard Transcript</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center animate-in slide-in-from-bottom duration-700">
      <div className="max-w-4xl w-full bg-[#004d30] p-12 rounded-t-3xl border-t-8 border-x-4 border-[#1a1a1a] shadow-2xl relative">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/50 uppercase tracking-[0.5em]">
          House of Commons • In Session
        </div>
        
        <div className="text-center space-y-10 py-12">
          <div className="text-white/60 font-serif italic text-2xl">"The Right Honourable Gentleman asks..."</div>
          <h2 className="text-4xl font-bold cinzel leading-relaxed text-white h-32 flex items-center justify-center">
            {QUESTIONS[currentQuestion]}
          </h2>
        </div>

        {feedback && (
          <div className="absolute inset-0 z-50 bg-[#1a1a1a]/95 flex flex-col items-center justify-center p-8 text-center rounded-t-3xl animate-in fade-in zoom-in duration-300">
            <div className="text-7xl font-black text-white mb-6 border-b-4 border-white/20 pb-4">{feedback.score}/10</div>
            <p className="text-2xl italic text-white/80 font-serif max-w-xl">"{feedback.commentary}"</p>
          </div>
        )}
      </div>

      <div className="max-w-4xl w-full bg-[#fdf6e3] p-10 rounded-b-3xl border-b-4 border-x-4 border-[#1a1a1a] flex flex-wrap justify-center gap-6 shadow-xl relative overflow-hidden">
        {/* Decorative Ink Splat */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#1a1a1a] opacity-5 -translate-y-10 translate-x-10 rounded-full blur-2xl"></div>

        {loading ? (
          <div className="py-16 text-center w-full h-36 flex flex-col justify-center items-center">
            <div className="w-16 h-16 border-4 border-t-[#8b0000] border-transparent rounded-full animate-spin"></div>
            <p className="mt-6 cinzel text-xs font-bold uppercase tracking-widest text-[#8b0000]">Order! Order in the House!</p>
          </div>
        ) : (
          RESPONSE_CARDS.map(card => (
            <button
              key={card.id}
              onClick={() => handleResponse(card.label)}
              className="w-48 h-36 p-5 bg-[#f4ece1] hover:bg-[#e8dcc4] border-2 border-[#1a1a1a]/20 hover:border-[#8b0000] rounded-lg transition-all flex flex-col items-center justify-center text-center group shadow-sm hover:shadow-md"
            >
              <span className={`text-[9px] uppercase font-black mb-3 tracking-widest ${
                card.style === 'AGGRESSIVE' ? 'text-red-700' : 
                card.style === 'WITTY' ? 'text-purple-700' : 'text-blue-700'
              }`}>
                {card.style}
              </span>
              <span className="text-sm font-bold cinzel leading-tight group-hover:text-[#8b0000]">{card.label}</span>
              <div className="mt-3 h-0.5 w-0 group-hover:w-full bg-[#8b0000] transition-all duration-300" />
            </button>
          ))
        )}
      </div>
      <div className="mt-6 text-[10px] font-bold uppercase text-[#8b0000] tracking-[0.3em]">Hansard Official Transcript</div>
    </div>
  );
};

export default PMQSession;
