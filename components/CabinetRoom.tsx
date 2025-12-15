
import React from 'react';
import { Minister, ROLES } from '../types';

interface CabinetRoomProps {
  ministers: Minister[];
  onAssign: (ministerId: string, roleId: string) => void;
}

const CabinetRoom: React.FC<CabinetRoomProps> = ({ ministers, onAssign }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-white border-4 border-black p-12 shadow-2xl">
        <h2 className="cinzel text-5xl font-black mb-12 uppercase tracking-tighter border-b-8 border-black pb-4">Cabinet Room</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">Government Offices</h3>
            {ROLES.map(role => {
              const assigned = ministers.find(m => m.assignedRoleId === role.id);
              return (
                <div key={role.id} className="border-2 border-black p-6 flex items-center justify-between hover:bg-zinc-50">
                  <div className="flex items-center space-x-6">
                    <span className="text-4xl grayscale">{role.icon}</span>
                    <div>
                      <p className="font-bold cinzel text-sm uppercase tracking-widest">{role.label}</p>
                      {assigned ? (
                        <p className="text-sm italic font-serif text-zinc-600">Held by: {assigned.name}</p>
                      ) : (
                        <p className="text-sm font-serif font-black text-red-700 animate-pulse">VACANT - Urgent Action Required</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">Available Personnel</h3>
            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-4 custom-scrollbar">
              {ministers.map(m => (
                <div key={m.id} className={`border border-zinc-300 p-4 flex items-center space-x-4 bg-zinc-50 ${m.isResigned ? 'opacity-30' : ''}`}>
                  <img src={m.portrait} alt={m.name} className="w-16 h-16 grayscale border-2 border-black object-cover" />
                  <div className="flex-1">
                    <p className="text-xl font-bold font-serif italic">{m.name}</p>
                    <p className="text-[10px] font-black uppercase text-zinc-400">{m.role}</p>
                  </div>
                  {!m.isResigned ? (
                    <select 
                      onChange={(e) => onAssign(m.id, e.target.value)}
                      value={m.assignedRoleId || ''}
                      className="bg-white border-2 border-black text-xs font-bold p-1 cinzel focus:outline-none"
                    >
                      <option value="">(Bench)</option>
                      {ROLES.map(r => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-[9px] font-black text-red-900 uppercase border border-red-900 px-1">Resigned</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="text-center font-serif italic opacity-50">"A cabinet is a group of people who are collectively responsible for things they didn't do."</p>
    </div>
  );
};

export default CabinetRoom;
