import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Dog, Trophy, BarChart2, User, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const Navbar = () => {
  const location = useLocation();
  
  // Hide navbar on login and tracker pages
  const hideOn = ['/login', '/tracker'];
  if (hideOn.includes(location.pathname)) return null;

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/pet-space', icon: Dog, label: 'Pet' },
    { to: '/treasure', icon: Gift, label: 'Treasure' },
    { to: '/rankings', icon: Trophy, label: 'Rank' },
    { to: '/insights', icon: BarChart2, label: 'Stats' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-8 px-6 pointer-events-none">
      <div className="max-w-2xl w-full glass-light card-rounded p-3 flex justify-between items-center shadow-2xl pointer-events-auto border-white/60">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              cn(
                "flex flex-col items-center gap-1.5 px-4 py-2 rounded-[20px] transition-all duration-500 md:flex-row md:gap-3 md:px-6 relative group",
                isActive ? "text-white" : "text-text-muted hover:text-brand"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-brand shadow-[0_10px_20px_rgba(126,232,224,0.4)] rounded-[20px] -z-10"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <item.icon size={20} fill={isActive ? "currentColor" : "none"} className={cn("transition-transform duration-300", isActive && "scale-110")} />
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest md:text-xs transition-opacity duration-300",
                  isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                )}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
