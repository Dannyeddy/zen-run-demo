import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Zap, ChevronRight, Compass, Heart } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Compass className="text-amber-500" size={32} />,
      title: 'Historical Routes',
      description: 'Discover ancient stories and earn unique Treasure collectibles.',
      color: 'bg-amber-50'
    },
    {
      icon: <Heart className="text-rose-500" size={32} />,
      title: 'Modern Routes',
      description: 'Daily training to earn Pet Food and support your companion\'s vitality.',
      color: 'bg-rose-50'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface flex flex-col items-center justify-center p-8"
    >
      <div className="max-w-2xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-text-main">Welcome to Zen-run</h1>
          <p className="text-text-muted max-w-md mx-auto">Your journey combines physical wellness with spiritual discovery. Here's how it works.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              className="card-rounded p-8 bg-white shadow-xl flex flex-col items-center text-center space-y-6"
            >
              <div className={`w-20 h-20 ${f.color} rounded-[32px] flex items-center justify-center shadow-inner`}>
                {f.icon}
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-text-main">{f.title}</h2>
                <p className="text-sm text-text-muted leading-relaxed">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-6">
          <p className="text-xs text-text-muted uppercase tracking-[0.2em] font-black">Ready to discover your first path?</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary px-12 py-5 text-lg shadow-2xl group"
          >
            Start Exploring <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Onboarding;
