import React, { useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Home, Box, RefreshCcw, Info, Star } from 'lucide-react';
import { useDemo } from '../context/DemoContext';

const HistoricalRewardResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { rewardState, routeState, saveHistoricalReward, selectRoute, selectedRoute } = useDemo();
  const stats = location.state || { routeName: routeState.selectedRouteName || 'Ancient Temple Path' };

  useEffect(() => {
    saveHistoricalReward();
  }, [saveHistoricalReward]);

  const rewardTitle = rewardState.rewardName || 'Ancient Silk Fan';
  const rewardImage = rewardState.rewardImage;
  const routeName = stats.routeName || routeState.selectedRouteName || 'Ancient Temple Path';
  const rerunRoute = useMemo(() => selectedRoute, [selectedRoute]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0A1A19] flex flex-col items-center py-20 px-6 relative overflow-hidden"
    >
      {/* Decorative Light Rays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-brand/10 blur-[150px] rounded-full -z-10 animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-[400px] aspect-square bg-amber-500/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-2xl w-full flex flex-col items-center space-y-16">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-center gap-3 text-brand mb-4"
          >
            <Sparkles size={24} />
            <span className="text-[12px] font-black uppercase tracking-[0.6em]">Treasure Unearthed</span>
            <Sparkles size={24} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-none">{rewardTitle}</h1>
          <div className="text-amber-400 font-black text-xs uppercase tracking-widest bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20">
            Relic of {routeName}
          </div>
        </div>

        {/* The Treasure Artifact */}
        <motion.div 
          initial={{ scale: 0.5, rotateY: 90 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 60 }}
          className="relative group perspective-[1000px]"
        >
          <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] relative pointer-events-none">
             {/* Glow Effect */}
            <div className="absolute inset-0 bg-brand/20 blur-[60px] rounded-full animate-pulse" />
             {/* The image itself */}
             <img 
              src={rewardImage}
              alt="Treasure"
              className="w-full h-full object-cover rounded-[60px] border-4 border-brand/30 shadow-[0_0_100px_rgba(126,232,224,0.3)] relative z-10 brightness-110 sepia-[0.3]"
              referrerPolicy="no-referrer"
            />
            {/* Overlay Icon */}
            <div className="absolute bottom-8 right-8 z-20 w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20">
              <Star size={32} fill="white" className="text-white" />
            </div>
          </div>
        </motion.div>

        <div className="card-rounded p-10 bg-white/5 border border-white/10 backdrop-blur-md max-w-lg w-full text-center space-y-6">
          <p className="text-white/80 text-base leading-relaxed font-medium">
            {`"This delicate artifact was whispered of in local legends. By completing the ${routeName} route, you have restored its legacy in the spiritual archives."`}
          </p>
          <div className="flex items-center justify-center gap-4 py-4 bg-brand/5 rounded-2xl border border-brand/10">
            <Info className="text-brand" size={20} />
            <p className="text-[12px] font-bold text-brand-dark/80 italic">
              Repeat this route soon to unlock the Tier II Jade Inlay.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg">
           <button 
            onClick={() => navigate('/treasure')}
            className="btn-primary py-6 text-xl shadow-2xl shadow-brand/20 uppercase tracking-[0.2em] flex items-center justify-center gap-4"
          >
            <Box size={24} /> Gallery
          </button>
           <button 
            onClick={() => navigate('/')}
            className="bg-white/10 hover:bg-white/20 transition-all text-white py-6 rounded-3xl text-xl font-bold border border-white/10 flex items-center justify-center gap-4 backdrop-blur-md"
          >
            <Home size={24} /> Sanctum
          </button>
        </div>

        <button 
          onClick={() => {
            if (rerunRoute) {
              selectRoute(rerunRoute);
              navigate('/tracker', { state: { route: rerunRoute } });
              return;
            }
            navigate('/tracker');
          }}
          className="flex items-center gap-3 text-white/40 hover:text-brand transition-colors text-sm font-black uppercase tracking-[0.4em]"
        >
          <RefreshCcw size={16} /> Re-Run Route
        </button>
      </div>
    </motion.div>
  );
};

export default HistoricalRewardResult;
