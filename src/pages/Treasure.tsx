import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Star, MapPin, Lock, Search, X, Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../context/PetContext';

const Treasure = () => {
  const navigate = useNavigate();
  const { equipItem, equippedItem } = usePet();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEquipping, setIsEquipping] = useState(false);

  const treasures = [
    { id: 1, title: 'Ancient Coin', rarity: 'Rare', type: 'Relic', img: 'https://images.unsplash.com/photo-1589476993333-f55b84301219?auto=format&fit=crop&q=80&w=200', locked: false },
    { id: 2, title: 'Temple Map', rarity: 'Common', type: 'Scroll', img: 'https://images.unsplash.com/photo-1586444248902-2f64eddf13cf?auto=format&fit=crop&q=80&w=200', locked: false },
    { id: 3, title: 'Vitality Orb', rarity: 'Epic', type: 'Essence', img: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=200', locked: false },
    { id: 4, title: 'Silk Ribbon', rarity: 'Common', type: 'Fabric', img: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=200', locked: false },
    { id: 5, title: 'Jade Flute', rarity: 'Rare', type: 'Instrument', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=200', locked: true },
    { id: 6, title: 'Lotus Seed', rarity: 'Uncommon', type: 'Seed', img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=200', locked: true },
  ];

  const handleEquip = () => {
    if (!selectedItem) return;
    setIsEquipping(true);
    
    // Immediate equip animation sequence
    setTimeout(() => {
      equipItem(selectedItem);
      setTimeout(() => {
        setIsEquipping(false);
        setSelectedItem(null);
        navigate('/pet-space');
      }, 800);
    }, 400);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface flex flex-col items-center p-8 pb-32"
    >
      <div className="max-w-5xl w-full">
        <header className="space-y-6 mb-10 text-left">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="text-[10px] font-black text-brand-dark uppercase tracking-[0.3em]">Collection</div>
              <h1 className="text-4xl font-display font-bold text-text-main">Treasure Gallery</h1>
            </div>
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-text-muted shadow-soft border border-brand/5">
              <Search size={22} />
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            {['All', 'Relics', 'Scrolls', 'Essence', 'Fabric', 'Instruments', 'Seeds'].map((tab, i) => (
              <button 
                key={tab} 
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${i === 0 ? 'bg-brand text-white shadow-soft' : 'bg-white text-text-muted border border-brand/10 hover:border-brand/40'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {treasures.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={item.locked ? {} : { y: -5 }}
              onClick={() => !item.locked && setSelectedItem(item)}
              className={`card-rounded p-5 flex flex-col gap-5 relative overflow-hidden group shadow-md transition-all duration-500 bg-white ${item.locked ? 'grayscale opacity-60' : 'cursor-pointer hover:shadow-2xl'}`}
            >
              <AnimatePresence>
                {equippedItem?.id === item.id && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 left-2 z-30 bg-brand text-white p-1 rounded-full shadow-lg"
                  >
                    <Check size={12} strokeWidth={4} />
                  </motion.div>
                )}
              </AnimatePresence>

              {item.locked && (
                <div className="absolute inset-0 bg-text-main/5 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-text-muted shadow-2xl border border-brand/10">
                    <Lock size={20} />
                  </div>
                </div>
              )}
              
              <div className="absolute top-0 right-0 bg-brand/10 text-brand-dark px-4 py-1.5 rounded-bl-3xl text-[9px] font-black uppercase tracking-widest z-20">
                {item.rarity}
              </div>

              <div className="aspect-square rounded-[28px] overflow-hidden shadow-sm bg-surface relative">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <div className="text-base font-bold text-text-main group-hover:text-brand-dark transition-colors">{item.title}</div>
                <div className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-70">{item.type}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 card-rounded p-8 bg-brand text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-brand/20 w-full"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center shadow-inner">
              <Gift size={32} className="text-white" />
            </div>
            <div className="text-left">
              <div className="text-[12px] font-black uppercase tracking-[0.2em] opacity-80">Collection Progress</div>
              <div className="text-2xl font-display font-bold">12 / 48 Items Logged</div>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="text-3xl font-display font-bold">25%</div>
            <div className="w-48 h-2.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '25%' }} className="h-full bg-white shadow-[0_0_10px_white]" />
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 z-[101] max-w-lg mx-auto w-full"
            >
              <div className="bg-white rounded-t-[40px] p-10 shadow-2xl space-y-8 flex flex-col items-center text-center">
                <div className="w-20 h-1.5 bg-surface rounded-full mb-2" />
                
                <div className="relative">
                  <motion.div 
                    animate={isEquipping ? { scale: [1, 1.2, 0], opacity: [1, 1, 0] } : {}}
                    className="w-48 h-48 rounded-[48px] overflow-hidden border-8 border-brand/10 shadow-2xl"
                  >
                    <img src={selectedItem.img} alt={selectedItem.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </motion.div>
                  {isEquipping && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 2.5, opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Sparkles className="text-brand w-24 h-24" />
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-black text-brand-dark uppercase tracking-[0.4em]">{selectedItem.type}</div>
                  <h2 className="text-3xl font-display font-bold text-text-main">{selectedItem.title}</h2>
                  <p className="text-text-muted text-sm max-w-xs mx-auto">
                    Enhance your companion's vitality with this unique artifact found during your journeys.
                  </p>
                </div>

                <div className="flex gap-4 w-full">
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="flex-1 py-5 rounded-[24px] bg-surface text-text-muted font-bold text-sm tracking-widest uppercase"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleEquip}
                    disabled={isEquipping}
                    className="flex-[2] btn-primary py-5 rounded-[24px] shadow-xl relative overflow-hidden group"
                  >
                    <span className={isEquipping ? 'opacity-0' : 'opacity-100'}>
                      {equippedItem?.id === selectedItem.id ? 'Refit Item' : 'Equip on Pet'}
                    </span>
                    {isEquipping && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-brand-dark"
                      >
                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      </motion.div>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Treasure;
