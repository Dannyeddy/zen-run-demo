import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, MapPin, Heart, Zap, ChevronRight, Star, X, Info, Trophy, Compass, Utensils } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useDemo } from '../context/DemoContext';

const Home = () => {
  const navigate = useNavigate();
  const {
    routes,
    routeState,
    selectedCompanion,
    userState,
    selectRoute,
    startRun: startRunSession,
  } = useDemo();
  const [activeTab, setActiveTab] = useState<'historical' | 'modern'>(
    routeState.selectedRouteType === 'Modern' ? 'modern' : 'historical',
  );
  const [selectedRoute, setSelectedRoute] = useState<any>(null);

  const filteredRoutes = useMemo(
    () => routes.filter((r) => r.type.toLowerCase() === activeTab),
    [activeTab, routes],
  );

  const handleRouteClick = (route: any) => {
    selectRoute(route);
    setSelectedRoute(route);
  };

  const startRun = () => {
    if (!selectedRoute) {
      return;
    }

    selectRoute(selectedRoute);
    startRunSession();
    navigate('/tracker', { state: { route: selectedRoute } });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface flex flex-col"
    >
      <header className="px-8 pt-10 pb-6 flex justify-center sticky top-0 z-30 bg-white/40 backdrop-blur-sm">
        <div className="max-w-5xl w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center shadow-soft">
              <Zap className="text-white" size={20} fill="white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-text-main tracking-tight">Zen-run</h1>
          </div>
          <Link to="/profile">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 rounded-full border-2 border-brand p-1 bg-white shadow-sm cursor-pointer"
            >
              <img 
                src={selectedCompanion?.img ?? 'https://api.dicebear.com/7.x/bottts/svg?seed=fluid-pet&backgroundColor=b6e3f4'} 
                alt="Pet Avatar" 
                className="w-full h-full rounded-full"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-8 pt-4 pb-24 space-y-12">
        {/* 2. Motivational Line & Pet Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-left">
            <div className="space-y-1">
              <p className="text-text-muted font-bold text-xs uppercase tracking-[0.2em]">Welcome back</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-text-main leading-tight">
                Discover your <br />
                <span className="text-brand-dark italic">vitality path.</span>
              </h2>
              <p className="text-sm text-text-muted font-medium">
                {userState.userName ? `${userState.userName}, your next story run is ready.` : 'Your next story run is ready.'}
              </p>
            </div>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="card-rounded p-8 flex items-center gap-6 relative overflow-hidden h-full shadow-lg bg-white"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-12 -mt-12" />
            <div className="w-20 h-20 bg-brand/10 rounded-[28px] flex items-center justify-center relative z-10 shrink-0">
              <img 
                src={selectedCompanion?.img ?? 'https://api.dicebear.com/7.x/bottts/svg?seed=fluid-pet&backgroundColor=b6e3f4'} 
                alt="Pet" 
                className="w-14 h-14"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 relative z-10 text-left">
              <div className="text-lg font-bold text-text-main">
                {selectedCompanion?.name ?? 'Aqua Companion'}
              </div>
              <p className="text-xs text-text-muted mt-1 font-medium">
                {selectedCompanion?.type ?? 'Energetic'} Wellness Explorer
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    className="h-full bg-brand rounded-full" 
                  />
                </div>
                <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest">85% Energy</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4. Tab selection */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-brand/10 pb-4">
            <div className="flex gap-8">
              <button 
                onClick={() => setActiveTab('historical')}
                className={cn(
                  "relative font-display font-black text-sm uppercase tracking-[0.2em] transition-all pb-4",
                  activeTab === 'historical' ? "text-text-main" : "text-text-muted hover:text-text-main"
                )}
              >
                Historical Paths
                {activeTab === 'historical' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand rounded-t-full" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('modern')}
                className={cn(
                  "relative font-display font-black text-sm uppercase tracking-[0.2em] transition-all pb-4",
                  activeTab === 'modern' ? "text-text-main" : "text-text-muted hover:text-text-main"
                )}
              >
                Modern Currents
                {activeTab === 'modern' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand rounded-t-full" />
                )}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredRoutes.map((route) => (
              <motion.div 
                key={route.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                layout
                onClick={() => handleRouteClick(route)}
                className="card-rounded p-5 bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group flex gap-6"
              >
                <div className="w-32 h-32 rounded-3xl overflow-hidden shrink-0 shadow-md">
                  <img 
                    src={route.img} 
                    alt={route.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                      route.type === 'Historical' ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                    )}>
                      {route.type}
                    </span>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{route.reward}</span>
                  </div>
                  <div className="font-bold text-text-main text-lg leading-tight group-hover:text-brand-dark transition-colors">{route.title}</div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold">
                      <MapPin size={12} className="text-brand-dark" /> {route.dist}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold">
                      <Heart size={12} className="text-brand-dark" /> {route.time}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 5. Quick Preview Modal */}
        <AnimatePresence>
          {selectedRoute && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedRoute(null)}
                className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="fixed bottom-0 left-0 right-0 z-[101] max-w-2xl mx-auto w-full"
              >
                <div className="bg-white rounded-t-[40px] p-10 shadow-2xl space-y-8 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-2",
                        selectedRoute.type === 'Historical' ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                      )}>
                        {selectedRoute.type} Path
                      </div>
                      <h3 className="text-3xl font-display font-bold text-text-main">{selectedRoute.title}</h3>
                    </div>
                    <button 
                      onClick={() => setSelectedRoute(null)}
                      className="p-3 bg-surface rounded-full text-text-muted hover:bg-surface/80"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="aspect-[2/1] w-full rounded-[32px] overflow-hidden shadow-soft">
                    <img src={selectedRoute.img} alt={selectedRoute.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="card-rounded p-6 bg-surface/50 border border-brand/10 space-y-2">
                      <div className={cn(
                        "flex items-center gap-2",
                        selectedRoute.type === 'Historical' ? "text-brand-dark" : "text-rose-600"
                      )}>
                        {selectedRoute.type === 'Historical' ? <Compass size={18} /> : <Zap size={18} />}
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-1">
                          {selectedRoute.type === 'Historical' ? "Discovery Goal" : "Training Benefit"}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-text-main uppercase">
                        {selectedRoute.type === 'Historical' ? "Uncover Ancient Artifacts" : "High Intensity Cardio"}
                      </p>
                    </div>
                    <div className="card-rounded p-6 bg-surface/50 border border-brand/10 space-y-2 text-left">
                      <div className={cn(
                        "flex items-center gap-2",
                        selectedRoute.type === 'Historical' ? "text-amber-600" : "text-brand-dark"
                      )}>
                        {selectedRoute.type === 'Historical' ? <Trophy size={18} /> : <Utensils size={18} />}
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-1">Reward Pool</span>
                      </div>
                      <p className="text-sm font-bold text-text-main uppercase">{selectedRoute.reward}</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-left">
                    <h4 className="font-bold text-text-main">Route Details</h4>
                    <p className="text-text-muted text-sm leading-relaxed">{selectedRoute.description}</p>
                    <div className="p-4 bg-brand/5 border border-brand/10 rounded-2xl flex items-start gap-3">
                      <Info size={16} className="text-brand-dark mt-0.5 shrink-0" />
                      <p className="text-[11px] text-brand-dark font-medium leading-relaxed">
                        {selectedRoute.type === 'Historical' 
                          ? "Tip: Revisiting this route in the future can unlock higher-tier rewards as your spiritual bond deepens."
                          : "Tip: Regular training on Modern routes ensures your companion stays in peak physical condition."}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={startRun}
                    className="w-full btn-primary py-6 text-xl shadow-2xl group"
                  >
                    Start Exploration <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default Home;
