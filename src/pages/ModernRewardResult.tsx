import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Home, Utensils, RefreshCcw, Heart, Zap } from 'lucide-react';
import { usePet } from '../context/PetContext';

const ModernRewardResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addFood } = usePet();
  const stats = location.state || { routeName: "Riverside Serenity" };

  useEffect(() => {
    // Add food to inventory when reaching this page
    addFood(2);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface flex flex-col items-center py-20 px-6 relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-brand/5 blur-[150px] rounded-full -z-10" />
      
      <div className="max-w-2xl w-full flex flex-col items-center space-y-12">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-center gap-3 text-brand-dark mb-4"
          >
            <Sparkles size={24} />
            <span className="text-[12px] font-black uppercase tracking-[0.6em]">Training Complete</span>
            <Sparkles size={24} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-main tracking-tight leading-none">Vitality Boost</h1>
          <p className="text-text-muted font-medium">Daily training nutrition secured.</p>
        </div>

        {/* The Food Package */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative"
        >
          <div className="w-[280px] h-[280px] md:w-[350px] md:h-[350px] bg-white rounded-[60px] shadow-2xl border-4 border-brand/20 flex flex-col items-center justify-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16" />
            
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-40 h-40 bg-brand/10 rounded-full flex items-center justify-center text-brand"
            >
              <Utensils size={80} fill="currentColor" />
            </motion.div>
            
            <div className="text-center space-y-1">
              <div className="text-3xl font-display font-bold text-text-main">+2 Portions</div>
              <div className="text-[10px] font-black text-brand-dark uppercase tracking-widest">Premium Pet Food</div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
              <div className="flex items-center gap-1 text-pink-500">
                <Heart size={14} fill="currentColor" /> <span className="text-xs font-bold">+10 Affinity</span>
              </div>
              <div className="flex items-center gap-1 text-brand">
                <Zap size={14} fill="currentColor" /> <span className="text-xs font-bold">+20 Stamina</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="card-rounded p-8 bg-white border border-brand/10 max-w-lg w-full text-center space-y-4 shadow-xl">
          <p className="text-text-main font-medium leading-relaxed">
            "Regular training on Modern routes ensures your companion stays in peak physical condition. Use this food in the sanctuary to restore energy."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg">
           <button 
            onClick={() => navigate('/pet-space')}
            className="btn-primary py-6 text-xl shadow-2xl shadow-brand/20 uppercase tracking-[0.2em] flex items-center justify-center gap-4"
          >
            Go to Pet
          </button>
           <button 
            onClick={() => navigate('/')}
            className="bg-white hover:bg-surface transition-all text-text-main py-6 rounded-3xl text-xl font-bold border border-brand/20 flex items-center justify-center gap-4 shadow-md"
          >
            <Home size={24} /> Home
          </button>
        </div>

        <button 
          onClick={() => navigate('/tracker', { state: { routeType: 'modern' } })}
          className="flex items-center gap-3 text-text-muted hover:text-brand transition-colors text-sm font-black uppercase tracking-[0.4em]"
        >
          <RefreshCcw size={16} /> Re-Run Route
        </button>
      </div>
    </motion.div>
  );
};

export default ModernRewardResult;
