import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Camera, Settings, Bell, Shield, LogOut, ChevronRight, Palette } from 'lucide-react';

const Profile = () => {
  const [petSeed, setPetSeed] = useState('aqua');

  const colors = [
    { name: 'Aqua', seed: 'aqua', color: 'bg-[#b6e3f4]' },
    { name: 'Mint', seed: 'mint', color: 'bg-[#c1f2e8]' },
    { name: 'Zen', seed: 'zen', color: 'bg-[#e2f2c1]' },
    { name: 'Rose', seed: 'rose', color: 'bg-[#f2c1d1]' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface flex flex-col items-center p-8 pb-32"
    >
      <div className="max-w-5xl w-full">
        <header className="flex justify-between items-center mb-16">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-text-main tracking-tight">Profile Settings</h1>
            <p className="text-text-muted text-sm font-medium uppercase tracking-[0.2em] opacity-60">Manage your Zen-run experience</p>
          </div>
          <button className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-text-muted shadow-soft border border-brand/10 hover:border-brand/40 transition-colors">
            <Settings size={24} />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Pet Customization Section */}
          <div className="card-rounded p-10 flex flex-col items-center gap-10 relative overflow-hidden bg-white shadow-2xl border border-brand/5">
            <div className="absolute top-0 left-0 w-full h-40 bg-brand/10 -z-10" />
            
            <div className="relative group">
              <motion.div 
                key={petSeed}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-48 h-48 md:w-56 md:h-56 rounded-[64px] border-8 border-white bg-white shadow-2xl p-4 overflow-hidden"
              >
                <img 
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${petSeed}&backgroundColor=b6e3f4`} 
                  alt="Pet" 
                  className="w-full h-full rounded-[48px] group-hover:scale-110 transition-transform duration-700"
                />
              </motion.div>
              <button className="absolute bottom-4 right-4 w-14 h-14 bg-brand text-white rounded-3xl flex items-center justify-center border-4 border-white shadow-xl hover:scale-110 transition-transform">
                <Camera size={24} />
              </button>
            </div>

            <div className="w-full space-y-10">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-display font-bold text-text-main">Aqua Pup</h2>
                <div className="inline-block px-4 py-1.5 bg-brand/10 rounded-full text-[11px] font-black text-brand-dark uppercase tracking-widest border border-brand/20">
                  Tier 4 Soul Companion
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[12px] font-black text-text-muted uppercase tracking-widest px-2 opacity-70">
                  <Palette size={14} /> Color Configuration
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {colors.map((c) => (
                    <button 
                      key={c.seed}
                      onClick={() => setPetSeed(c.seed)}
                      className={`h-16 rounded-[24px] transition-all border-4 relative overflow-hidden group shadow-md ${petSeed === c.seed ? 'border-brand scale-110 shadow-xl' : 'border-white hover:border-brand/20'} ${c.color}`}
                    >
                      {petSeed === c.seed && (
                        <motion.div layoutId="color-active" className="absolute inset-0 bg-white/10" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full btn-primary py-5 text-[11px] font-black tracking-[0.3em] shadow-[0_15px_30px_rgba(126,232,224,0.3)] hover:shadow-brand/40 uppercase">
                Save Essence Configuration
              </button>
            </div>
          </div>

          {/* Account Settings List */}
          <div className="space-y-8 flex flex-col h-full justify-between">
            <div className="space-y-6">
              <h3 className="text-sm font-black text-text-muted uppercase tracking-[0.3em] pl-2">System Preferences</h3>
              <div className="space-y-4">
                {[
                  { icon: Bell, label: 'Push Notifications', value: 'Active', desc: 'Alerts for checkpoints & achievements' },
                  { icon: Shield, label: 'Privacy & Lockdown', value: 'High', desc: 'Control visibility on rankings' },
                  { icon: User, label: 'Identity Management', value: '', desc: 'Update display name and email' },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 10 }}
                    className="card-rounded p-6 flex items-center justify-between cursor-pointer bg-white shadow-md border border-brand/5 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-brand/5 rounded-2xl flex items-center justify-center text-brand-dark shadow-inner">
                        <item.icon size={26} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-lg font-bold text-text-main block">{item.label}</span>
                        <span className="text-[10px] text-text-muted font-medium opacity-60 uppercase tracking-widest">{item.desc}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-text-muted">
                      {item.value && <span className="text-xs font-black uppercase tracking-widest text-brand-dark px-3 py-1 bg-brand/10 rounded-full">{item.value}</span>}
                      <ChevronRight size={20} className="opacity-40" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 0.98 }}
              className="w-full card-rounded p-8 flex items-center justify-between text-rose-500 bg-rose-50/80 mt-12 border border-rose-100 group transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                  <LogOut size={28} />
                </div>
                <div className="text-left">
                  <span className="text-xl font-bold block">Sign Out</span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">End Current Session</span>
                </div>
              </div>
              <ChevronRight size={24} className="opacity-40 group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
