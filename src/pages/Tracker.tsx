import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Square, Pause, Play, MapPin, Heart, Zap, X, Volume2, Award, Gift, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Tracker = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [distance, setDistance] = useState(0);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [isLandmarkExpanded, setIsLandmarkExpanded] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
        setDistance(d => d + 0.005);
        if (seconds === 10) setShowCheckpoint(true);
        if (seconds === 20) setShowReward(true);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const location = useLocation();
  const route = location.state?.route || { type: 'Historical', title: 'Ancient Temple Path' };

  const handleStop = () => {
    navigate('/completion-summary', { 
      state: { 
        time: formatTime(seconds), 
        distance: distance.toFixed(2),
        pace: "5'12\"",
        checkpoints: showCheckpoint ? 1 : 0,
        routeName: route.title,
        routeType: route.type
      } 
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen bg-surface relative overflow-hidden flex flex-col items-center"
    >
      {/* 1. Map Background: Dominant Element */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1920" 
          alt="Map" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brand/5 backdrop-blur-[1px]" />
        
        {/* Route Visualization Logic */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path d="M100,600 Q200,400 300,550 T500,450 T700,500 T900,400" fill="none" stroke="#7EE8E0" strokeWidth="12" strokeLinecap="round" className="opacity-60 drop-shadow-lg" />
          <motion.circle 
            animate={{ r: [10, 16, 10], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            cx="300" cy="550" r="12" fill="white" stroke="#7EE8E0" strokeWidth="6" 
          />
        </svg>
      </div>

      <div className="max-w-7xl w-full h-full p-8 flex flex-col relative z-10 pointer-events-none">
        {/* 2. Top Stats Header */}
        <header className="w-full flex justify-center items-start pt-4 pointer-events-auto">
          <div className="glass-light card-rounded p-8 flex gap-12 items-center shadow-2xl border-white/80 max-w-4xl w-full justify-around backdrop-blur-xl">
            <div className="text-center group">
              <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] mb-2 opacity-70 group-hover:text-brand-dark transition-colors">Distance Traveled</div>
              <div className="text-4xl font-display font-bold text-text-main leading-tight">{distance.toFixed(2)}<span className="text-lg ml-1 opacity-60">km</span></div>
            </div>
            <div className="w-px h-16 bg-brand/30" />
            <div className="text-center group">
              <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] mb-2 opacity-70 group-hover:text-brand-dark transition-colors">Active Duration</div>
              <div className="text-4xl font-display font-bold text-text-main leading-tight tracking-widest">{formatTime(seconds)}</div>
            </div>
            <div className="w-px h-16 bg-brand/30" />
            <div className="text-center group">
              <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] mb-2 opacity-70 group-hover:text-brand-dark transition-colors">Current Pace</div>
              <div className="text-4xl font-display font-bold text-text-main leading-tight">5'12"</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-brand/30" />
            <div className="hidden md:flex items-center gap-6 group">
               <div className="w-16 h-16 bg-white/40 rounded-3xl flex items-center justify-center text-pink-500 shadow-inner group-hover:scale-110 transition-transform">
                  <Heart size={32} fill="currentColor" className="opacity-80" />
               </div>
               <div className="text-left">
                  <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] mb-1 opacity-70">Heart Rate</div>
                  <div className="text-2xl font-display font-bold text-text-main">138 <span className="text-xs">bpm</span></div>
               </div>
            </div>
          </div>
        </header>

        {/* 3. Floating Interactive Elements */}
        <div className="flex-1 w-full relative">
          {/* Pet Encouragement Presence */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-12 right-0 flex flex-col items-end gap-6 pointer-events-auto"
          >
            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[32px] shadow-2xl border-2 border-brand/20 max-w-[280px] relative group hover:scale-105 transition-transform">
              <p className="text-sm font-bold text-text-main leading-relaxed italic opacity-90">
                "We're approaching the <span className="text-brand-dark">Beisi Pagoda</span>! Such ancient energy radiating from the structures ahead."
              </p>
              <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white/95 rotate-45 border-r-2 border-b-2 border-brand/20" />
            </div>
            <div className="w-24 h-24 rounded-[40px] border-4 border-white p-2 bg-brand shadow-2xl hover:rotate-12 transition-transform">
              <img 
                src="https://api.dicebear.com/7.x/bottts/svg?seed=aqua&backgroundColor=b6e3f4" 
                alt="Pet" 
                className="w-full h-full rounded-[28px]"
              />
            </div>
          </motion.div>

          {/* Side Tools */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-6 pointer-events-auto">
             {[MapPin, Award, Zap, Volume2].map((Icon, i) => (
               <motion.button
                key={i}
                whileHover={{ x: 10, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 bg-white shadow-xl rounded-3xl flex items-center justify-center text-brand-dark border border-brand/10 hover:bg-brand hover:text-white transition-all"
               >
                 <Icon size={28} />
               </motion.button>
             ))}
          </div>
        </div>

        {/* 4. Bottom Action Control Area */}
        <div className="w-full flex justify-center items-end pb-12 pointer-events-auto">
          <div className="glass-light p-6 rounded-[48px] border-2 border-white/60 shadow-2xl flex items-center gap-12 backdrop-blur-xl">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsActive(!isActive)}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-text-main shadow-xl border-4 border-surface"
            >
              {isActive ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleStop}
              className="w-32 h-32 rounded-full bg-brand text-white flex items-center justify-center shadow-[0_30px_60px_rgba(126,232,224,0.4)] border-[12px] border-white relative group"
            >
              <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
              <Square size={48} fill="currentColor" className="relative z-10" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-text-main shadow-xl border-4 border-surface"
            >
              <Zap size={32} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* 5. Checkpoint Popup: Landmark discovery overlay */}
      <AnimatePresence>
        {showCheckpoint && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-40 left-1/2 -translate-x-1/2 z-[60] w-full max-w-lg px-8 pointer-events-auto"
          >
            <motion.div 
              layout
              className="card-rounded bg-white shadow-[0_30px_60px_rgba(0,0,0,0.2)] border-2 border-brand/20 overflow-hidden flex flex-col"
            >
              {!isLandmarkExpanded ? (
                <div 
                  onClick={() => setIsLandmarkExpanded(true)}
                  className="p-6 flex items-center gap-6 cursor-pointer group"
                >
                  <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-100 shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-brand rounded-full animate-ping" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark">Landmark Nearby</span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-text-main group-hover:text-brand-dark transition-colors">Beisi Pagoda Discovered</h3>
                  </div>
                  <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-text-muted opacity-40 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={20} />
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                  <div className="relative h-48 md:h-56">
                    <img 
                      src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800" 
                      className="w-full h-full object-cover"
                      alt="Beisi Pagoda"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowCheckpoint(false); setIsLandmarkExpanded(false); }}
                      className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/30 hover:bg-black/40 transition-colors"
                    >
                      <X size={20} />
                    </button>
                    <div className="absolute bottom-4 left-6">
                      <div className="text-white/80 text-[10px] font-black uppercase tracking-[0.4em]">Ancient Relic</div>
                      <h3 className="text-white text-3xl font-display font-bold">Beisi Pagoda</h3>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <p className="text-sm text-text-muted leading-relaxed italic font-medium opacity-90">
                      "Standing as a silent guardian for over 1,700 years, this 'North Temple Pagoda' remains a testament to the enduring spirit of Suzhou's heritage."
                    </p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => { setIsLandmarkExpanded(false); setIsActive(true); }}
                        className="flex-1 btn-primary py-4 text-[10px] font-black tracking-[0.3em] shadow-xl uppercase"
                      >
                        Capture Moment
                      </button>
                      <button className="w-14 h-14 rounded-2xl border-2 border-brand/10 flex items-center justify-center text-brand-dark bg-surface shadow-sm hover:bg-white transition-all">
                        <Volume2 size={24} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Reward Milestone Popup: Strict Card Style */}
      <AnimatePresence>
        {showReward && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="absolute bottom-48 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-8"
          >
            <div className="card-rounded p-8 flex items-center gap-10 bg-white shadow-[0_30px_60px_rgba(126,232,224,0.3)] border-4 border-brand/30 relative overflow-hidden group">
              <div className="absolute -left-10 -top-10 w-32 h-32 bg-brand/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="w-20 h-20 bg-brand rounded-3xl flex items-center justify-center text-white shadow-2xl relative z-10">
                <Award size={40} className="drop-shadow-lg" />
              </div>
              <div className="flex-1 relative z-10">
                <div className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-dark mb-2">Grand Milestone Reached</div>
                <div className="text-3xl font-display font-bold text-text-main leading-tight">1km Spirit Integration</div>
              </div>
              <div className="text-right pr-6 relative z-10">
                <div className="text-sm font-black text-brand-dark uppercase tracking-widest">+10 Essence</div>
                <div className="text-sm font-black text-brand-dark uppercase tracking-widest">+5 Affinity</div>
              </div>
              <button 
                onClick={() => setShowReward(false)}
                className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-text-muted hover:text-rose-500 transition-colors shadow-inner"
              >
                <X size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Tracker;
