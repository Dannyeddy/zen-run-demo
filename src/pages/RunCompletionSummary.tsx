import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Award, ChevronRight, Clock, MapPin, Zap, ArrowLeft, Trophy, Utensils } from 'lucide-react';
import { cn } from '../lib/utils';

const RunCompletionSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stats = location.state || {
    time: "25:42",
    distance: "3.20",
    pace: "5'12\"",
    checkpoints: 1,
    routeName: "Ancient Temple Path",
    routeType: "Historical"
  };

  const isHistorical = stats.routeType === "Historical";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface flex flex-col items-center py-12 px-6"
    >
      <div className="max-w-xl w-full space-y-12">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-brand rounded-full flex items-center justify-center mx-auto shadow-2xl"
          >
            <Trophy className="text-white" size={48} />
          </motion.div>
          <h1 className="text-5xl font-display font-bold text-text-main tracking-tight">Run Complete</h1>
          <div className="flex items-center justify-center gap-2">
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
              isHistorical ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-rose-100 text-rose-800 border-rose-200"
            )}>
              {stats.routeType} Route
            </span>
            <span className="text-text-muted font-bold text-sm tracking-tight">{stats.routeName}</span>
          </div>
        </div>

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="card-rounded p-10 bg-white shadow-2xl border-2 border-brand/5 space-y-10"
        >
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center group">
              <MapPin className="mx-auto mb-3 text-brand-dark opacity-40 group-hover:opacity-100 transition-opacity" size={20} />
              <div className="text-3xl font-display font-bold text-text-main">{stats.distance} <span className="text-xs opacity-50">km</span></div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Distance</div>
            </div>
            <div className="text-center group">
              <Clock className="mx-auto mb-3 text-brand-dark opacity-40 group-hover:opacity-100 transition-opacity" size={20} />
              <div className="text-3xl font-display font-bold text-text-main">{stats.time}</div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Duration</div>
            </div>
            <div className="text-center group">
              <Zap className="mx-auto mb-3 text-brand-dark opacity-40 group-hover:opacity-100 transition-opacity" size={20} />
              <div className="text-3xl font-display font-bold text-text-main">{stats.pace}</div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Avg Pace</div>
            </div>
          </div>

          <div className="h-px bg-surface w-full" />

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm",
                isHistorical ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-brand/10 text-brand border-brand/10"
              )}>
                {isHistorical ? <Award size={24} /> : <Utensils size={24} />}
              </div>
              <div className="text-left">
                <div className="text-text-main font-bold">{isHistorical ? "Discovery Found" : "Nutrition Secured"}</div>
                <div className="text-xs text-text-muted">{isHistorical ? "Part of Beisi Pagoda History" : "Premium Pet Supplement"}</div>
              </div>
            </div>
            <div className={cn(
              "text-2xl font-display font-bold",
              isHistorical ? "text-amber-600" : "text-brand"
            )}>
              x{isHistorical ? stats.checkpoints : "2"}
            </div>
          </div>

          <div className="bg-surface/50 p-6 rounded-[24px] border border-brand/10">
            <p className="text-sm text-text-main font-medium leading-relaxed italic text-center">
              {isHistorical 
                ? "\"You completed a meaningful historical run. Your journey uncovered a piece of local memory today.\""
                : "\"Great training session! This Modern route run has generated high-energy portions for your companion.\""}
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate(isHistorical ? '/reward-result' : '/modern-reward', { state: stats })}
            className="w-full btn-primary py-7 text-2xl shadow-[0_20px_50px_rgba(126,232,224,0.4)] uppercase tracking-[0.3em] group"
          >
            Retrieve Rewards <ChevronRight className="group-hover:translate-x-2 transition-transform" />
          </button>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-5 text-text-muted font-black text-xs uppercase tracking-widest hover:text-text-main transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Sanctuary
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RunCompletionSummary;
