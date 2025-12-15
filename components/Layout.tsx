
import React from 'react';
import { Stats, GamePhase, Day } from '../types';

interface LayoutProps {
  stats: Stats;
  phase: GamePhase;
  onNavigate: (phase: GamePhase) => void;
  children: React.ReactNode;
}

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

const Layout: React.FC<LayoutProps> = ({ stats, phase, onNavigate, children }) => {
  const currentDateStr = getGameDate(stats.week, stats.day);

  return (
    <div className="flex h-screen overflow-hidden text-[#1a1a1a]">
      {/* Sidebar - Heavy Parchment Style */}
      <nav className="w-20 md:w-72 border-r-4 border-black bg-[#e8dcc4] flex flex-col shrink-0 parchment-scroll z-30 shadow-2xl">
        <div className="p-10 text-center border-b-4 border-black/10">
          <div className="w-16 h-16 wax-seal mx-auto mb-4 text-sm scale-110">N<sup>o</sup>10</div>
          <h1 className="cinzel text-2xl font-black text-red-900 hidden md:block tracking-tighter scale-y-110">PREMIER'S DESK</h1>
        </div>

        <div className="flex-1 py-10 space-y-6 px-4">
          <NavItem active={phase === GamePhase.DASHBOARD} onClick={() => onNavigate(GamePhase.DASHBOARD)} icon="📜" label="THE DISPATCH" />
          <NavItem active={phase === GamePhase.CABINET} onClick={() => onNavigate(GamePhase.CABINET)} icon="⚖️" label="PRIVY COUNCIL" />
          <NavItem active={phase === GamePhase.CHARACTERS} onClick={() => onNavigate(GamePhase.CHARACTERS)} icon="👤" label="THE LEDGER" />
          <NavItem active={phase === GamePhase.MEDIA} onClick={() => onNavigate(GamePhase.MEDIA)} icon="🗞️" label="THE GAZETTE" />
        </div>

        <div className="p-8 bg-black/5 text-[11px] font-black text-red-900 uppercase tracking-[0.3em] text-center border-t-2 border-black/10">
           {stats.day}<br/>Week {stats.week}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative flex flex-col bg-[#fdf6e3]">
        {/* Top Header - Document Style */}
        <header className="sticky top-0 z-20 bg-[#fdf6e3]/98 backdrop-blur-sm border-b-4 border-black px-12 flex items-center justify-between py-6 shadow-sm">
          <div className="flex items-center space-x-16">
            <div className="flex flex-col border-r-4 border-red-900/10 pr-12">
              <span className="text-[13px] uppercase font-black tracking-[0.3em] text-red-800 mb-0.5">{stats.day.toUpperCase()}</span>
              <span className="text-lg font-bold cinzel tracking-tighter opacity-80">{currentDateStr}</span>
            </div>
            
            <div className="flex space-x-10 items-center">
              <StatDisplay label="Public Approval" value={`${stats.approval}%`} />
              <StatDisplay label="Party Unity" value={`${stats.partyUnity}%`} />
              <StatDisplay label="Treasury" value={`£${stats.budget}bn`} />
              <div className="h-8 w-[1px] bg-black/10"></div>
              <StatDisplay label="Security" value={`${stats.nationalSecurity}%`} />
              <StatDisplay label="Media" value={`${stats.mediaPerception}%`} />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <span className="block text-[10px] uppercase font-black text-red-800 tracking-widest">Action Points</span>
              <div className="flex space-x-1 justify-end mt-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`h-2 w-6 border border-black ${i < stats.actionsLeft ? 'bg-red-800' : 'bg-transparent opacity-20'}`}></div>
                ))}
              </div>
            </div>
            <div className="w-12 h-12 border-4 border-black flex items-center justify-center font-black italic text-xl rotate-3 bg-white/50 shadow-lg">
               {stats.week}
            </div>
          </div>
        </header>

        <div className="p-12 flex-1 w-full relative">
          {/* Subtle Watermarks */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden select-none">
             <div className="text-[200px] font-serif rotate-[-30deg] -translate-y-40 -translate-x-40 font-black">TOP SECRET</div>
             <div className="text-[200px] font-serif rotate-[-30deg] translate-y-96 translate-x-96 font-black">EYES ONLY</div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean, onClick: () => void, icon: string, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center p-5 border-2 transition-all duration-300 ${active ? 'bg-black text-[#fdf6e3] border-black shadow-lg translate-x-2' : 'border-transparent hover:border-black/10 hover:bg-black/5'}`}
  >
    <span className="text-2xl">{icon}</span>
    <span className="ml-5 font-black cinzel text-[12px] hidden md:block uppercase tracking-[0.3em]">{label}</span>
  </button>
);

const StatDisplay: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-[10px] uppercase tracking-[0.2em] text-red-900/60 font-black cinzel">{label}</span>
    <span className="text-2xl font-black italic font-serif leading-none mt-1 tracking-tighter">{value}</span>
  </div>
);

export default Layout;
