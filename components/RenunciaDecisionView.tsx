import React, { useState } from 'react';
import { GamePlayer, ThemeConfig, RenunciaDecision } from '../types';
import { Shield, X, Users, AlertTriangle, Eye, Check } from 'lucide-react';

interface Props {
  candidatePlayer: GamePlayer;
  otherPlayers: GamePlayer[];
  theme: ThemeConfig;
  canTransfer: boolean;
  onDecision: (decision: RenunciaDecision) => void;
}

export const RenunciaDecisionView: React.FC<Props> = ({
  candidatePlayer,
  otherPlayers,
  theme,
  canTransfer,
  onDecision
}) => {
  const [selected, setSelected] = useState<RenunciaDecision | null>(null);

  const handleConfirm = () => {
    if (!selected) return;
    if (navigator.vibrate) navigator.vibrate([30, 50]);
    onDecision(selected);
  };

  return (
    <div className="flex flex-col h-full items-center justify-between p-6 pb-12 relative z-10 animate-in slide-in-from-bottom-4 duration-500 pt-[calc(2rem+env(safe-area-inset-top))]">
      {/* Header */}
      <div className="text-center w-full mt-4 flex flex-col items-center gap-1.5 animate-in slide-in-from-top duration-700">
        <span className="text-xs font-black text-red-500 uppercase tracking-widest animate-pulse">
          Eres un Impostor
        </span>
        <span className="text-[10px] text-black font-bold uppercase tracking-wider max-w-[260px] leading-snug">
          Te ha tocado el Protocolo Renuncia
        </span>
        <h3 className="text-2xl font-bold mt-4 mb-2 flex items-center gap-2 justify-center" style={{ color: theme.text }}>
          <Eye size={22} className="text-amber-500" />
          Protocolo Renuncia
        </h3>
        <p style={{ color: theme.sub }} className="text-sm font-medium max-w-xs mx-auto leading-relaxed">
          Elige una opción y pasa el teléfono al siguiente jugador.
        </p>
      </div>

      {/* Options */}
      <div className="w-full max-w-sm flex-1 flex flex-col justify-center gap-3 my-4">
        {/* OPTION A: ACCEPT */}
        <button
          onClick={() => setSelected('accept')}
          className="group relative w-full p-4 rounded-2xl border active:scale-[0.98] transition-all duration-200 text-left overflow-hidden backdrop-blur-md"
          style={{
            borderWidth: selected === 'accept' ? '2px' : '1px',
            borderColor: selected === 'accept' ? '#10b981' : theme.border,
            backgroundColor: theme.cardBg,
            boxShadow: selected === 'accept' 
              ? '0 0 20px rgba(16,185,129,0.3), inset 0 0 12px rgba(16,185,129,0.15)' 
              : '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <div className="flex justify-between items-start mb-1">
            <span style={{ color: selected === 'accept' ? '#10b981' : theme.sub }} className="text-[10px] font-black uppercase tracking-[0.2em]">
              Aceptar Destino
            </span>
            {selected === 'accept' ? (
              <Check size={16} className="text-green-500 animate-in zoom-in duration-200" />
            ) : (
              <Shield size={16} className="text-green-500 opacity-40 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black uppercase tracking-tight" style={{ color: theme.text }}>
              Asumir Rol
            </h3>
            <p className="text-[10px] leading-relaxed opacity-70" style={{ color: theme.sub }}>
              Continúa como Impostor y procede normalmente con la misión.
            </p>
          </div>
        </button>

        {/* OPTION B: REJECT */}
        <button
          onClick={() => setSelected('reject')}
          className="group relative w-full p-4 rounded-2xl border active:scale-[0.98] transition-all duration-200 text-left overflow-hidden backdrop-blur-md"
          style={{
            borderWidth: selected === 'reject' ? '2px' : '1px',
            borderColor: selected === 'reject' ? '#ef4444' : theme.border,
            backgroundColor: theme.cardBg,
            boxShadow: selected === 'reject' 
              ? '0 0 20px rgba(239,68,68,0.3), inset 0 0 12px rgba(239,68,68,0.15)' 
              : '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <div className="flex justify-between items-start mb-1">
            <span style={{ color: selected === 'reject' ? '#ef4444' : theme.sub }} className="text-[10px] font-black uppercase tracking-[0.2em]">
              Rechazar Rol
            </span>
            {selected === 'reject' ? (
              <Check size={16} className="text-red-500 animate-in zoom-in duration-200" />
            ) : (
              <X size={16} className="text-red-500 opacity-40 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black uppercase tracking-tight" style={{ color: theme.text }}>
              Ser Civil
            </h3>
            <p className="text-[10px] leading-relaxed opacity-70" style={{ color: theme.sub }}>
              Tu plaza de impostor queda vacante. El grupo jugará con menos impostores.
            </p>
          </div>
        </button>

        {/* OPTION C: TRANSFER */}
        <button
          onClick={() => setSelected('transfer')}
          disabled={!canTransfer}
          className="group relative w-full p-4 rounded-2xl border active:scale-[0.98] transition-all duration-200 text-left overflow-hidden backdrop-blur-md disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            borderWidth: selected === 'transfer' ? '2px' : '1px',
            borderColor: selected === 'transfer' ? '#8b5cf6' : theme.border,
            backgroundColor: theme.cardBg,
            boxShadow: selected === 'transfer' 
              ? '0 0 20px rgba(139,92,246,0.3), inset 0 0 12px rgba(139,92,246,0.15)' 
              : '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <div className="flex justify-between items-start mb-1">
            <span style={{ color: selected === 'transfer' ? '#8b5cf6' : theme.sub }} className="text-[10px] font-black uppercase tracking-[0.2em]">
              Transferir Rol
            </span>
            {selected === 'transfer' ? (
              <Check size={16} className="text-purple-400 animate-in zoom-in duration-200" />
            ) : (
              <Users size={16} className="text-purple-400 opacity-40 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black uppercase tracking-tight" style={{ color: theme.text }}>
              Pasar Destino
            </h3>
            <p className="text-[10px] leading-relaxed opacity-70" style={{ color: theme.sub }}>
              Pasa tu destino al jugador con más Karma (civil elegible). No sabrás quién es.
            </p>
            {!canTransfer && (
              <p className="text-[9px] text-red-500 font-bold leading-none mt-1">
                No hay jugadores elegibles disponibles para transferir.
              </p>
            )}
          </div>
        </button>
      </div>

      {/* Controls */}
      <div className="w-full max-w-sm space-y-3">
        {/* Fixed height container to prevent layout shifting */}
        <div className="h-14 w-full relative">
          <button
            onClick={handleConfirm}
            disabled={!selected}
            aria-hidden={!selected}
            tabIndex={selected ? 0 : -1}
            style={{
              backgroundColor: theme.accent,
              boxShadow: selected ? `0 0 20px ${theme.accent}40` : 'none',
              opacity: selected ? 1 : 0,
              transform: selected ? 'scale(1)' : 'scale(0.95)',
              pointerEvents: selected ? 'auto' : 'none'
            }}
            className="absolute inset-0 w-full h-full rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 text-white transition-all duration-300 transform-gpu active:scale-95"
          >
            Confirmar y pasar al siguiente jugador
          </button>
        </div>

        <div className="flex items-start justify-center gap-1.5 opacity-60 px-2 text-center">
          <span className="text-[9px] uppercase tracking-wider w-full animate-pulse flex items-center justify-center gap-1 text-amber-500 font-bold">
            <AlertTriangle size={10} /> Decisión Irreversible. Solo tú puedes ver esto.
          </span>
        </div>
      </div>
    </div>
  );
};
