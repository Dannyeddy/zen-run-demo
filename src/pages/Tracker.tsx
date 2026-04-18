import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Square,
  Pause,
  Play,
  MapPin,
  Heart,
  Zap,
  X,
  Volume2,
  Award,
  ChevronRight,
  LocateFixed,
  Compass,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';

interface GeoPoint {
  latitude: number;
  longitude: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const haversineDistanceKm = (start: GeoPoint, end: GeoPoint) => {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const latDiff = toRadians(end.latitude - start.latitude);
  const lonDiff = toRadians(end.longitude - start.longitude);
  const lat1 = toRadians(start.latitude);
  const lat2 = toRadians(end.latitude);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

const Tracker = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    routeState,
    selectedRoute,
    runState,
    selectedCompanion,
    startRun,
    setLocationStatus,
    updateRunMetrics,
    triggerLandmarkDiscovery,
    expandHistoricalCard,
    closeDiscovery,
    completeRun,
  } = useDemo();

  const [isPaused, setIsPaused] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const lastPointRef = useRef<GeoPoint | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const discoveryTimerRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const distanceRef = useRef(runState.distance);
  const durationRef = useRef(runState.duration);

  const route = location.state?.route || selectedRoute || {
    id: routeState.selectedRouteId || 'h1',
    type: routeState.selectedRouteType || 'Historical',
    title: routeState.selectedRouteName || 'Ancient Temple Path',
  };

  const locationStatusText = useMemo(() => {
    switch (runState.locationStatus) {
      case 'loading':
        return 'Requesting live GPS...';
      case 'success':
        return 'Live location connected';
      case 'denied':
        return 'Location permission denied';
      case 'error':
        return 'Unable to get your location';
      default:
        return 'Waiting to request location';
    }
  }, [runState.locationStatus]);

  useEffect(() => {
    startRun();
  }, [startRun]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    distanceRef.current = runState.distance;
    durationRef.current = runState.duration;
  }, [runState.distance, runState.duration]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    setLocationStatus('loading');

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const nextPoint = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setLocationStatus('success', nextPoint);

        if (!isPausedRef.current && lastPointRef.current) {
          const segmentDistance = haversineDistanceKm(lastPointRef.current, nextPoint);
          const nextDistance =
            segmentDistance > 0.0015 ? distanceRef.current + segmentDistance : distanceRef.current;
          updateRunMetrics({ distance: nextDistance });
        }

        lastPointRef.current = nextPoint;
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus('denied');
          return;
        }
        setLocationStatus('error');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 15000,
      },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [setLocationStatus, updateRunMetrics]);

  useEffect(() => {
    if (isPaused || runState.locationStatus !== 'success') {
      return;
    }

    const intervalId = window.setInterval(() => {
      updateRunMetrics({
        duration: durationRef.current + 1,
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isPaused, runState.locationStatus, updateRunMetrics]);

  useEffect(() => {
    if (!runState.landmarkTriggered || showReward) {
      return;
    }

    setShowReward(true);
  }, [runState.landmarkTriggered, showReward]);

  useEffect(() => {
    return () => {
      if (discoveryTimerRef.current !== null) {
        window.clearTimeout(discoveryTimerRef.current);
      }
    };
  }, []);

  const handleStop = () => {
    const summary = completeRun();
    navigate('/completion-summary', {
      state: {
        time: formatTime(summary.duration),
        distance: summary.distance.toFixed(2),
        pace: summary.pace,
        checkpoints: summary.landmarkTriggered ? 1 : 0,
        routeName: summary.routeName,
        routeType: summary.routeType,
      },
    });
  };

  const handleDemoDiscovery = () => {
    if (runState.locationStatus !== 'success') {
      return;
    }

    triggerLandmarkDiscovery();
    if (discoveryTimerRef.current !== null) {
      window.clearTimeout(discoveryTimerRef.current);
    }
    discoveryTimerRef.current = window.setTimeout(() => {
      expandHistoricalCard();
    }, 1200);
  };

  const handleCloseDiscovery = () => {
    closeDiscovery();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen bg-surface relative overflow-hidden flex flex-col items-center"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1920"
          alt="Map"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brand/5 backdrop-blur-[1px]" />

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M100,600 Q200,400 300,550 T500,450 T700,500 T900,400"
            fill="none"
            stroke="#7EE8E0"
            strokeWidth="12"
            strokeLinecap="round"
            className="opacity-60 drop-shadow-lg"
          />
          <motion.circle
            animate={{ r: [10, 16, 10], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            cx="300"
            cy="550"
            r="12"
            fill="white"
            stroke="#7EE8E0"
            strokeWidth="6"
          />
        </svg>
      </div>

      <div className="max-w-7xl w-full h-full p-8 flex flex-col relative z-10 pointer-events-none">
        <header className="w-full flex flex-col items-center gap-4 pt-4 pointer-events-auto">
          <div className="glass-light card-rounded p-8 flex gap-12 items-center shadow-2xl border-white/80 max-w-4xl w-full justify-around backdrop-blur-xl">
            <div className="text-center group">
              <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] mb-2 opacity-70 group-hover:text-brand-dark transition-colors">
                Distance Traveled
              </div>
              <div className="text-4xl font-display font-bold text-text-main leading-tight">
                {runState.distance.toFixed(2)}
                <span className="text-lg ml-1 opacity-60">km</span>
              </div>
            </div>
            <div className="w-px h-16 bg-brand/30" />
            <div className="text-center group">
              <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] mb-2 opacity-70 group-hover:text-brand-dark transition-colors">
                Active Duration
              </div>
              <div className="text-4xl font-display font-bold text-text-main leading-tight tracking-widest">
                {formatTime(runState.duration)}
              </div>
            </div>
            <div className="w-px h-16 bg-brand/30" />
            <div className="text-center group">
              <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] mb-2 opacity-70 group-hover:text-brand-dark transition-colors">
                Current Pace
              </div>
              <div className="text-4xl font-display font-bold text-text-main leading-tight">
                {runState.pace}
              </div>
            </div>
            <div className="hidden md:block w-px h-16 bg-brand/30" />
            <div className="hidden md:flex items-center gap-6 group">
              <div className="w-16 h-16 bg-white/40 rounded-3xl flex items-center justify-center text-pink-500 shadow-inner group-hover:scale-110 transition-transform">
                <Heart size={32} fill="currentColor" className="opacity-80" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] mb-1 opacity-70">
                  Route
                </div>
                <div className="text-2xl font-display font-bold text-text-main">
                  {route.title}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-light card-rounded px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-xl border-white/70 max-w-4xl w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center text-brand-dark shadow-inner">
                <LocateFixed size={22} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">
                  Location Status
                </div>
                <div className="text-sm font-bold text-text-main">{locationStatusText}</div>
                <div className="text-[10px] text-text-muted font-medium mt-1">
                  {runState.currentLatitude !== null && runState.currentLongitude !== null
                    ? `${runState.currentLatitude.toFixed(5)}, ${runState.currentLongitude.toFixed(5)}`
                    : 'Waiting for coordinates'}
                </div>
              </div>
            </div>

            <button
              onClick={handleDemoDiscovery}
              disabled={runState.locationStatus !== 'success'}
              className="btn-primary py-4 px-6 text-xs uppercase tracking-[0.25em] shadow-xl disabled:opacity-50"
            >
              Demo Discovery Trigger
            </button>
          </div>
        </header>

        <div className="flex-1 w-full relative">
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-12 right-0 flex flex-col items-end gap-6 pointer-events-auto"
          >
            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[32px] shadow-2xl border-2 border-brand/20 max-w-[280px] relative group hover:scale-105 transition-transform">
              <p className="text-sm font-bold text-text-main leading-relaxed italic opacity-90">
                {runState.locationStatus === 'success'
                  ? `Live tracking is on. ${selectedCompanion?.name ?? 'Your companion'} is ready for a discovery moment near ${route.title}.`
                  : 'We are waiting for your real GPS signal before entering discovery mode.'}
              </p>
              <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white/95 rotate-45 border-r-2 border-b-2 border-brand/20" />
            </div>
            <div className="w-24 h-24 rounded-[40px] border-4 border-white p-2 bg-brand shadow-2xl hover:rotate-12 transition-transform">
              <img
                src={
                  selectedCompanion?.img ??
                  'https://api.dicebear.com/7.x/bottts/svg?seed=aqua&backgroundColor=b6e3f4'
                }
                alt="Pet"
                className="w-full h-full rounded-[28px]"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-6 pointer-events-auto">
            {[MapPin, Award, Compass, Volume2].map((Icon, i) => (
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

        <div className="w-full flex justify-center items-end pb-12 pointer-events-auto">
          <div className="glass-light p-6 rounded-[48px] border-2 border-white/60 shadow-2xl flex items-center gap-12 backdrop-blur-xl">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPaused((prev) => !prev)}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-text-main shadow-xl border-4 border-surface"
            >
              {isPaused ? <Play size={32} fill="currentColor" /> : <Pause size={32} />}
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
              onClick={handleDemoDiscovery}
              disabled={runState.locationStatus !== 'success'}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-text-main shadow-xl border-4 border-surface disabled:opacity-50"
            >
              <Zap size={32} />
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {runState.discoveryOverlayOpen && (
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
              {!runState.expandedHistoricalCardOpen ? (
                <div
                  onClick={expandHistoricalCard}
                  className="p-6 flex items-center gap-6 cursor-pointer group"
                >
                  <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-100 shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-brand rounded-full animate-ping" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark">
                        Landmark Nearby
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-text-main group-hover:text-brand-dark transition-colors">
                      Discovery Overlay Ready
                    </h3>
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
                      onClick={handleCloseDiscovery}
                      className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/30 hover:bg-black/40 transition-colors"
                    >
                      <X size={20} />
                    </button>
                    <div className="absolute bottom-4 left-6">
                      <div className="text-white/80 text-[10px] font-black uppercase tracking-[0.4em]">
                        Ancient Relic
                      </div>
                      <h3 className="text-white text-3xl font-display font-bold">Beisi Pagoda</h3>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <p className="text-sm text-text-muted leading-relaxed italic font-medium opacity-90">
                      "Standing as a silent guardian for over 1,700 years, this 'North Temple Pagoda'
                      remains a testament to the enduring spirit of Suzhou's heritage."
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={handleCloseDiscovery}
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
                <div className="text-[12px] font-black uppercase tracking-[0.3em] text-brand-dark mb-2">
                  Discovery Triggered
                </div>
                <div className="text-3xl font-display font-bold text-text-main leading-tight">
                  Historical Route Demo Ready
                </div>
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
