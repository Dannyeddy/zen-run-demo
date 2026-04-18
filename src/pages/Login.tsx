import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronRight, User } from 'lucide-react';
import { useDemo } from '../context/DemoContext';

const Login = () => {
  const navigate = useNavigate();
  const { companions, setUserProfile } = useDemo();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedPet, setSelectedPet] = useState<number | null>(null);

  const handlePetSelect = () => {
    if (!selectedPet) {
      return;
    }

    setUserProfile(name, selectedPet);
    navigate('/onboarding');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface flex flex-col items-center justify-center p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square bg-brand/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] aspect-square bg-brand/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-xl w-full space-y-12">
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 md:w-24 md:h-24 bg-brand rounded-[32px] flex items-center justify-center shadow-[0_20px_50px_rgba(126,232,224,0.4)] mx-auto"
          >
            <Zap className="text-white" size={40} fill="white" />
          </motion.div>
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-text-main tracking-tighter">Zen-run</h1>
            <p className="text-text-muted text-base font-medium opacity-80 italic">Step into ancient stories, one stride at a time.</p>
          </div>
        </div>

        {step === 1 ? (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="card-rounded p-8 bg-white shadow-2xl border border-brand/5 space-y-6"
          >
            <div className="space-y-4 text-center">
              <h2 className="text-xl font-bold text-text-main">Welcome Traveler</h2>
              <p className="text-sm text-text-muted">How shall we call you on this journey?</p>
            </div>
            
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-dark group-focus-within:scale-110 transition-transform">
                <User size={20} />
              </div>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Spirit Name" 
                className="w-full bg-surface/50 card-rounded py-5 pl-14 pr-6 text-text-main font-semibold text-lg focus:outline-none border-2 border-transparent focus:border-brand/40 focus:bg-white transition-all shadow-inner"
              />
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="w-full btn-primary py-5 text-lg shadow-2xl shadow-brand/30 group uppercase tracking-[0.2em] disabled:opacity-50"
            >
              Begin Your Journey <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-display font-bold text-text-main">Choose Your Soul Companion</h2>
              <p className="text-text-muted text-sm font-medium opacity-70">They will evolve alongside your spirit.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {companions.map((pet) => (
                <motion.div 
                  key={pet.id}
                  whileHover={{ x: 8, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedPet(pet.id)}
                  className={`card-rounded p-5 flex items-center gap-6 cursor-pointer transition-all border-4 ${selectedPet === pet.id ? 'border-brand bg-white shadow-2xl scale-102' : 'border-transparent bg-white/60 hover:bg-white shadow-md'}`}
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-brand/10 rounded-2xl flex items-center justify-center p-2 shadow-inner">
                    <img src={pet.img} alt={pet.name} className="w-full h-full" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-xl font-display font-bold text-text-main leading-tight">{pet.name}</div>
                    <div className="text-[10px] font-black text-brand-dark uppercase tracking-[0.2em] mt-1 opacity-80">{pet.type} Archetype</div>
                  </div>
                  {selectedPet === pet.id && (
                    <div className="w-6 h-6 bg-brand rounded-full flex items-center justify-center text-white">
                      <ChevronRight size={16} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            <button 
              onClick={handlePetSelect}
              disabled={!selectedPet}
              className="w-full btn-primary py-6 text-xl shadow-[0_20px_50px_rgba(126,232,224,0.4)] disabled:opacity-50 disabled:grayscale transition-all duration-500 uppercase tracking-[0.2em]"
            >
              Enter Sanctuary
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Login;
