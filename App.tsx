
import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import CabinetRoom from './components/CabinetRoom';
import PMQSession from './components/PMQSession';
import CharacterTab from './components/CharacterTab';
import MediaTab from './components/MediaTab';
import { GamePhase, Stats, Minister, PoliticalEvent, Day, DispatchAction } from './types';
import { INITIAL_STATS, INITIAL_MINISTERS } from './constants';
import { generatePoliticalEvent, generateDailyDispatch } from './services/geminiService';

const getGameDate = (week: number, day: Day) => {
  const startDate = new Date();
  const daysInWeek = 7;
  const dayIndex = Object.values(Day).indexOf(day);
  const totalDaysPassed = ((week - 1) * daysInWeek) + dayIndex;
  
  const gameDate = new Date(startDate);
  gameDate.setDate(startDate.getDate() + totalDaysPassed);
  
  return gameDate.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

const App: React.FC = () => {
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [ministers, setMinisters] = useState<Minister[]>(INITIAL_MINISTERS);
  const [phase, setPhase] = useState<GamePhase>(GamePhase.DASHBOARD);
  const [activeEvent, setActiveEvent] = useState<PoliticalEvent | null>(null);
  const [dispatchActions, setDispatchActions] = useState<DispatchAction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pmqDoneToday, setPmqDoneToday] = useState(false);

  useEffect(() => {
    setDispatchActions(generateDailyDispatch(INITIAL_STATS.day, INITIAL_MINISTERS));
  }, []);

  const checkGameOver = useCallback(() => {
    if (stats.approval <= 5) return "Downing Street has been stormed. The public is not amused.";
    if (stats.partyUnity <= 10) return "A vote of no confidence. Your own party has knifed you.";
    if (stats.budget <= -800) return "The IMF has taken control of the Treasury. We're broke.";
    if (stats.nationalSecurity <= 5) return "A catastrophe has occurred. The country is in shambles.";
    return null;
  }, [stats]);

  const advanceDay = () => {
    setIsProcessing(true);
    // Artificial slight delay for the 'paper shuffle' feel
    setTimeout(() => {
      const days = Object.values(Day);
      const currentIndex = days.indexOf(stats.day);
      let nextIndex = (currentIndex + 1) % days.length;
      let nextWeek = stats.week;
      if (nextIndex === 0) nextWeek += 1;

      const ignoredMinisterIds = new Set(dispatchActions.filter(a => a.linkedMinisterId).map(a => a.linkedMinisterId));
      
      const updatedMinisters = ministers.map(m => {
        let h = m.happiness;
        if (ignoredMinisterIds.has(m.id)) h = Math.max(0, h - 12);
        
        if (h < 20 && !m.isResigned && Math.random() > 0.7) {
           alert(`${m.name} has resigned. The letter was very short and very rude.`);
           return { ...m, happiness: h, isResigned: true, assignedRoleId: undefined };
        }
        return { ...m, happiness: h };
      });

      setMinisters(updatedMinisters);
      setStats(prev => ({
        ...prev,
        day: days[nextIndex],
        week: nextWeek,
        actionsLeft: 3
      }));

      setDispatchActions(generateDailyDispatch(days[nextIndex], updatedMinisters));
      setPmqDoneToday(false); // Reset PMQ flag for the new day
      
      const msg = checkGameOver();
      if (msg) {
        alert(msg);
        window.location.reload();
      }
      setIsProcessing(false);
    }, 600);
  };

  const handleDispatchAction = async (action: DispatchAction) => {
    if (stats.actionsLeft <= 0 || isProcessing) return;

    setIsProcessing(true);
    try {
      const linked = ministers.find(m => m.id === action.linkedMinisterId);
      const event = await generatePoliticalEvent(stats, action.type, linked);
      setActiveEvent(event);
      setPhase(GamePhase.EVENT);
      setDispatchActions(prev => prev.filter(a => a.id !== action.id));
      setStats(prev => ({ ...prev, actionsLeft: prev.actionsLeft - 1 }));
    } catch (err) {
      console.error(err);
      alert("Communication with the civil service failed. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEventChoice = (option: any) => {
    setStats(prev => ({
      ...prev,
      approval: Math.min(100, Math.max(0, prev.approval + (option.consequences.approval || 0))),
      partyUnity: Math.min(100, Math.max(0, prev.partyUnity + (option.consequences.partyUnity || 0))),
      budget: prev.budget + (option.consequences.budget || 0),
      influence: Math.min(100, Math.max(0, prev.influence + (option.consequences.influence || 0))),
      mediaPerception: Math.min(100, Math.max(0, (prev.mediaPerception || 50) + (option.consequences.mediaPerception || 0))),
      nationalSecurity: Math.min(100, Math.max(0, (prev.nationalSecurity || 50) + (option.consequences.nationalSecurity || 0))),
    }));

    if (option.consequences.ministerHappiness && Array.isArray(option.consequences.ministerHappiness)) {
      setMinisters(prev => prev.map(m => {
        const change = option.consequences.ministerHappiness.find((h: any) => h.ministerName === m.name);
        if (change) {
          return { ...m, happiness: Math.min(100, Math.max(0, m.happiness + change.happinessDelta)) };
        }
        return m;
      }));
    }

    setActiveEvent(null);
    setPhase(GamePhase.DASHBOARD);
  };

  const handlePMQComplete = (avgScore: number) => {
    const impact = (avgScore - 5) * 2.5;
    setStats(prev => ({
      ...prev,
      approval: Math.min(100, Math.max(0, prev.approval + impact)),
      mediaPerception: Math.min(100, Math.max(0, prev.mediaPerception + (avgScore - 5) * 1.5)),
      actionsLeft: Math.max(0, prev.actionsLeft - 1)
    }));
    setPmqDoneToday(true);
    setPhase(GamePhase.DASHBOARD);
  };

  const currentDateStr = getGameDate(stats.week, stats.day);

  return (
    <Layout stats={stats} phase={phase} onNavigate={setPhase}>
      {phase === GamePhase.DASHBOARD && (
        <div className="max-w-6xl mx-auto space-y-12 animate-paper pb-20">
          {/* Newspaper Masthead */}
          <div className="bg-white border-y-4 border-double border-black p-8 text-center shadow-lg relative">
             <div className="absolute left-6 top-6 text-[10px] font-black border-2 border-red-800 text-red-800 px-2 py-1 rotate-[-10deg] uppercase">Official Sensitive</div>
             <div className="absolute right-6 top-6 coffee-ring"></div>
             
             <h1 className="cinzel text-7xl font-black uppercase tracking-tighter mb-2 scale-y-110">Whitehall Dispatch</h1>
             
             <div className="flex justify-between border-t border-black py-2 text-[12px] font-bold uppercase tracking-[0.2em] px-4">
                <span>{stats.day.toUpperCase()}, {currentDateStr.toUpperCase()}</span>
                <span>Vol. {stats.week} • No. 10</span>
                <span>PM Energy: {stats.actionsLeft}/3</span>
             </div>

             <div className="mt-8 relative inline-block">
                <p className="text-3xl font-serif italic max-w-4xl leading-tight text-zinc-800 px-10">
                   "Government is a series of catastrophic events separated by tea breaks. You have {stats.actionsLeft} choices left before the day is out."
                </p>
                <div className="ink-stain -right-10 -bottom-10"></div>
             </div>
             
             <div className="mt-12 flex justify-center space-x-6">
                <button 
                  onClick={advanceDay}
                  className="btn-paper px-10 py-4 cinzel font-black hover:bg-zinc-900 hover:text-white transition-all flex items-center space-x-3 text-sm tracking-widest"
                >
                  <span>{stats.actionsLeft === 0 ? "📜" : "💤"}</span>
                  <span>{stats.actionsLeft === 0 ? "FINISH THE DAY" : "SLEEP & IGNORE EVERYONE"}</span>
                </button>

                {stats.day === Day.TUESDAY && stats.actionsLeft > 0 && !pmqDoneToday && (
                  <button 
                    onClick={() => setPhase(GamePhase.PMQ)}
                    className="bg-[#004d30] text-white px-10 py-4 cinzel font-black hover:bg-[#003d20] transition-all border-2 border-black shadow-[3px_3px_0px_#000] flex items-center space-x-3 text-sm tracking-widest"
                  >
                    <span>🎙️</span>
                    <span>FACE THE COMMONS</span>
                  </button>
                )}
             </div>
          </div>

          {/* Dispatch Cards - 2x2 Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
               {isProcessing && (
                 <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] border-4 border-dashed border-zinc-400 m-[-8px]">
                    <div className="w-16 h-16 border-8 border-t-black border-zinc-200 rounded-full animate-spin mb-6"></div>
                    <p className="cinzel text-xl font-black uppercase tracking-[0.3em] text-black">Briefing in progress...</p>
                 </div>
               )}
               
               {dispatchActions.map(action => {
                 const disabled = stats.actionsLeft <= 0;
                 return (
                  <button
                    key={action.id}
                    disabled={disabled || isProcessing}
                    onClick={() => handleDispatchAction(action)}
                    className={`group text-left p-10 border-2 border-black transition-all relative overflow-hidden flex flex-col justify-between ${disabled ? 'opacity-30 grayscale' : 'bg-white hover:bg-zinc-50 shadow-md hover:shadow-xl hover:-translate-y-1'}`}
                  >
                    <div className="gov-stamp absolute -bottom-4 -right-2 opacity-5 scale-150 group-hover:opacity-10 transition-opacity">APPROVED</div>
                    
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black text-red-800 uppercase tracking-[0.4em] border-b border-red-800/30 pb-1">{action.type}</span>
                        {action.linkedMinisterId && <span className="text-[18px]">👤</span>}
                      </div>
                      <h3 className="text-3xl font-bold font-serif mb-4 leading-tight group-hover:text-red-900 group-hover:underline decoration-red-900/30">{action.title}</h3>
                      <p className="text-lg font-serif italic text-zinc-600 leading-snug">{action.description}</p>
                    </div>

                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-zinc-100">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Box #10-A-{stats.week}</span>
                       <span className="text-[11px] font-black uppercase group-hover:text-red-800 flex items-center space-x-2">
                         <span>Open File</span>
                         <span className="text-xl transition-transform group-hover:translate-x-2">→</span>
                       </span>
                    </div>
                  </button>
                 );
               })}
            </div>

            {/* Side Column: Red Box Stats */}
            <div className="space-y-8">
               <div className="bg-zinc-100 border-2 border-black p-8 shadow-inner relative overflow-hidden">
                  <div className="absolute -top-10 -left-10 w-24 h-24 bg-red-800/5 rounded-full blur-2xl"></div>
                  <h4 className="cinzel text-xs font-black border-b-2 border-black mb-6 pb-2 uppercase tracking-widest">Confidential Memo</h4>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-tighter opacity-50">Party Unity</p>
                      <p className="text-md font-serif italic leading-tight">
                        {stats.partyUnity > 80 ? "The knives are temporarily sheathed." : 
                         stats.partyUnity > 40 ? "Whispers in the tea rooms are growing louder." : 
                         "Check your back for sharp objects, PM."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-tighter opacity-50">Economy</p>
                      <p className="text-md font-serif italic leading-tight">
                        {stats.budget > 100 ? "Treasury surplus is looking healthy. Briefly." : 
                         stats.budget > 0 ? "We're spending like sailors on leave." : 
                         "The Chancellor is hyperventilating in a cupboard."}
                      </p>
                    </div>
                  </div>
               </div>

               <div className="bg-white border-2 border-black p-8 shadow-md">
                 <div className="text-center">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-red-800">Constituency Pulse</p>
                   <div className="text-4xl font-black cinzel">{stats.approval}%</div>
                   <p className="text-[10px] italic font-serif mt-2">"Mostly harmless"</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Other phases (Cabinet, etc.) */}
      {phase === GamePhase.CABINET && (
        <CabinetRoom ministers={ministers} onAssign={(mId, rId) => {
          setMinisters(prev => prev.map(m => {
            if (m.assignedRoleId === rId) return { ...m, assignedRoleId: undefined };
            if (m.id === mId) return { ...m, assignedRoleId: rId };
            return m;
          }));
          setStats(prev => ({ ...prev, partyUnity: Math.min(100, prev.partyUnity + 2) }));
        }} />
      )}
      {phase === GamePhase.CHARACTERS && <CharacterTab ministers={ministers} />}
      {phase === GamePhase.MEDIA && <MediaTab stats={stats} />}
      
      {phase === GamePhase.EVENT && activeEvent && (
        <div className="max-w-4xl mx-auto animate-paper">
          <div className="bg-white border-4 border-black p-12 shadow-2xl relative">
            <div className="absolute top-6 right-6 gov-stamp opacity-20 rotate-12">Confidential</div>
            <h2 className="cinzel text-5xl font-black mb-8 uppercase tracking-tighter leading-none">{activeEvent.title}</h2>
            <div className="border-l-8 border-red-800 pl-8 mb-12">
              <p className="text-2xl italic font-serif leading-relaxed text-zinc-800">"{activeEvent.description}"</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {activeEvent.options.map((opt, i) => (
                <button 
                  key={i}
                  onClick={() => handleEventChoice(opt)}
                  className="p-8 text-left border-2 border-black hover:bg-black hover:text-white transition-all group shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xl font-bold font-serif uppercase tracking-tight">{opt.label}</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100">Sign Here</span>
                  </div>
                  <p className="text-lg font-serif opacity-80 mb-4 leading-tight">{opt.description}</p>
                  <div className="flex justify-between items-center text-[11px] font-bold border-t border-current pt-4 opacity-50 italic">
                    <span>"{opt.flavourText}"</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {phase === GamePhase.PMQ && <PMQSession onComplete={handlePMQComplete} />}
    </Layout>
  );
};

export default App;
