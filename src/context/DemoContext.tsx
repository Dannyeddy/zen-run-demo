import React, {
  useCallback,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  companions,
  defaultHistoricalReward,
  historicalRewards,
  RouteOption,
  routes,
  CompanionOption,
} from '../lib/demoData';

export type LocationStatus = 'idle' | 'loading' | 'success' | 'denied' | 'error';

export interface UserState {
  userName: string;
  selectedCompanion: CompanionOption | null;
  onboardingSeen: boolean;
}

export interface RouteState {
  selectedRouteId: string;
  selectedRouteName: string;
  selectedRouteType: string;
  routeDistance: string;
  estimatedDuration: string;
}

export interface RunState {
  isRunning: boolean;
  locationStatus: LocationStatus;
  currentLatitude: number | null;
  currentLongitude: number | null;
  duration: number;
  distance: number;
  pace: string;
  landmarkTriggered: boolean;
  discoveryOverlayOpen: boolean;
  expandedHistoricalCardOpen: boolean;
  runCompleted: boolean;
}

export interface RewardState {
  rewardType: string;
  rewardName: string;
  rewardImage: string;
  sourceRouteId: string;
}

export interface RunHistoryItem {
  id: string;
  routeId: string;
  routeName: string;
  routeType: string;
  duration: number;
  distance: number;
  pace: string;
  completedAt: string;
  landmarkTriggered: boolean;
}

export interface TreasureRewardItem extends RewardState {
  id: string;
  sourceRouteName: string;
  earnedAt: string;
}

interface DemoContextType {
  userState: UserState;
  routeState: RouteState;
  runState: RunState;
  rewardState: RewardState;
  selectedRoute: RouteOption | null;
  selectedCompanion: CompanionOption | null;
  runHistory: RunHistoryItem[];
  treasureRewards: TreasureRewardItem[];
  routes: RouteOption[];
  companions: CompanionOption[];
  setUserProfile: (userName: string, companionId: number) => void;
  markOnboardingSeen: () => void;
  selectRoute: (route: RouteOption) => void;
  startRun: () => void;
  setLocationStatus: (
    status: LocationStatus,
    coords?: { latitude: number; longitude: number },
  ) => void;
  updateRunMetrics: (values: Partial<Pick<RunState, 'duration' | 'distance' | 'pace'>>) => void;
  triggerLandmarkDiscovery: () => void;
  expandHistoricalCard: () => void;
  closeDiscovery: () => void;
  completeRun: () => RunHistoryItem;
  saveHistoricalReward: () => TreasureRewardItem;
  resetRunState: () => void;
}

const STORAGE_KEYS = {
  userName: 'userName',
  selectedCompanion: 'selectedCompanion',
  onboardingSeen: 'onboardingSeen',
  lastSelectedRoute: 'lastSelectedRoute',
  runHistory: 'runHistory',
  treasureRewards: 'treasureRewards',
} as const;

const defaultUserState: UserState = {
  userName: '',
  selectedCompanion: null,
  onboardingSeen: false,
};

const defaultRouteState: RouteState = {
  selectedRouteId: '',
  selectedRouteName: '',
  selectedRouteType: '',
  routeDistance: '',
  estimatedDuration: '',
};

const defaultRunState: RunState = {
  isRunning: false,
  locationStatus: 'idle',
  currentLatitude: null,
  currentLongitude: null,
  duration: 0,
  distance: 0,
  pace: '--',
  landmarkTriggered: false,
  discoveryOverlayOpen: false,
  expandedHistoricalCardOpen: false,
  runCompleted: false,
};

const defaultRewardState: RewardState = {
  rewardType: defaultHistoricalReward.rewardType,
  rewardName: defaultHistoricalReward.rewardName,
  rewardImage: defaultHistoricalReward.rewardImage,
  sourceRouteId: defaultHistoricalReward.sourceRouteId,
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readJson = <T,>(key: string, fallback: T): T => {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
};

const formatPace = (distanceKm: number, durationSeconds: number) => {
  if (distanceKm <= 0 || durationSeconds <= 0) {
    return '--';
  }

  const totalSecondsPerKm = Math.max(1, Math.round(durationSeconds / distanceKm));
  const minutes = Math.floor(totalSecondsPerKm / 60);
  const seconds = totalSecondsPerKm % 60;
  return `${minutes}'${seconds.toString().padStart(2, '0')}"`;
};

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>(() => {
    const storedCompanion = readJson<CompanionOption | null>(STORAGE_KEYS.selectedCompanion, null);
    return {
      userName: canUseStorage() ? window.localStorage.getItem(STORAGE_KEYS.userName) ?? '' : '',
      selectedCompanion: storedCompanion,
      onboardingSeen: readJson<boolean>(STORAGE_KEYS.onboardingSeen, false),
    };
  });

  const [routeState, setRouteState] = useState<RouteState>(() => {
    const storedRoute = readJson<RouteOption | null>(STORAGE_KEYS.lastSelectedRoute, null);
    if (!storedRoute) {
      return defaultRouteState;
    }
    return {
      selectedRouteId: storedRoute.id,
      selectedRouteName: storedRoute.title,
      selectedRouteType: storedRoute.type,
      routeDistance: storedRoute.dist,
      estimatedDuration: storedRoute.time,
    };
  });

  const [runState, setRunState] = useState<RunState>(defaultRunState);
  const [rewardState, setRewardState] = useState<RewardState>(defaultRewardState);
  const [runHistory, setRunHistory] = useState<RunHistoryItem[]>(
    () => readJson<RunHistoryItem[]>(STORAGE_KEYS.runHistory, []),
  );
  const [treasureRewards, setTreasureRewards] = useState<TreasureRewardItem[]>(
    () => readJson<TreasureRewardItem[]>(STORAGE_KEYS.treasureRewards, []),
  );

  const selectedRoute = useMemo(
    () => routes.find((route) => route.id === routeState.selectedRouteId) ?? null,
    [routeState.selectedRouteId],
  );

  useEffect(() => {
    if (!canUseStorage()) {
      return;
    }

    if (userState.userName) {
      window.localStorage.setItem(STORAGE_KEYS.userName, userState.userName);
    }
    writeJson(STORAGE_KEYS.selectedCompanion, userState.selectedCompanion);
    writeJson(STORAGE_KEYS.onboardingSeen, userState.onboardingSeen);
  }, [userState]);

  useEffect(() => {
    if (selectedRoute) {
      writeJson(STORAGE_KEYS.lastSelectedRoute, selectedRoute);
    }
  }, [selectedRoute]);

  useEffect(() => {
    writeJson(STORAGE_KEYS.runHistory, runHistory);
  }, [runHistory]);

  useEffect(() => {
    writeJson(STORAGE_KEYS.treasureRewards, treasureRewards);
  }, [treasureRewards]);

  const setUserProfile = useCallback((userName: string, companionId: number) => {
    const companion = companions.find((item) => item.id === companionId) ?? null;
    setUserState({
      userName: userName.trim(),
      selectedCompanion: companion,
      onboardingSeen: false,
    });
  }, []);

  const markOnboardingSeen = useCallback(() => {
    setUserState((prev) => ({ ...prev, onboardingSeen: true }));
  }, []);

  const selectRoute = useCallback((route: RouteOption) => {
    setRouteState({
      selectedRouteId: route.id,
      selectedRouteName: route.title,
      selectedRouteType: route.type,
      routeDistance: route.dist,
      estimatedDuration: route.time,
    });

    if (route.type === 'Historical') {
      const rewardTemplate = historicalRewards[route.id] ?? defaultHistoricalReward;
      setRewardState({
        rewardType: rewardTemplate.rewardType,
        rewardName: rewardTemplate.rewardName,
        rewardImage: rewardTemplate.rewardImage,
        sourceRouteId: rewardTemplate.sourceRouteId,
      });
    }
  }, []);

  const startRun = useCallback(() => {
    setRunState((prev) => ({
      ...defaultRunState,
      isRunning: true,
      locationStatus: prev.locationStatus === 'success' ? 'success' : 'loading',
    }));
  }, []);

  const setLocationStatus = useCallback((
    status: LocationStatus,
    coords?: { latitude: number; longitude: number },
  ) => {
    setRunState((prev) => ({
      ...prev,
      locationStatus: status,
      currentLatitude: coords?.latitude ?? prev.currentLatitude,
      currentLongitude: coords?.longitude ?? prev.currentLongitude,
      isRunning: status === 'success' ? true : prev.isRunning,
    }));
  }, []);

  const updateRunMetrics = useCallback((values: Partial<Pick<RunState, 'duration' | 'distance' | 'pace'>>) => {
    setRunState((prev) => ({
      ...prev,
      ...values,
      pace:
        values.pace ??
        formatPace(values.distance ?? prev.distance, values.duration ?? prev.duration),
    }));
  }, []);

  const triggerLandmarkDiscovery = useCallback(() => {
    setRunState((prev) => ({
      ...prev,
      landmarkTriggered: true,
      discoveryOverlayOpen: true,
    }));
  }, []);

  const expandHistoricalCard = useCallback(() => {
    setRunState((prev) => ({
      ...prev,
      landmarkTriggered: true,
      discoveryOverlayOpen: true,
      expandedHistoricalCardOpen: true,
    }));
  }, []);

  const closeDiscovery = useCallback(() => {
    setRunState((prev) => ({
      ...prev,
      discoveryOverlayOpen: false,
      expandedHistoricalCardOpen: false,
    }));
  }, []);

  const completeRun = useCallback(() => {
    const historyItem: RunHistoryItem = {
      id: `run-${Date.now()}`,
      routeId: routeState.selectedRouteId,
      routeName: routeState.selectedRouteName,
      routeType: routeState.selectedRouteType,
      duration: runState.duration,
      distance: Number(runState.distance.toFixed(2)),
      pace: runState.pace,
      completedAt: new Date().toISOString(),
      landmarkTriggered: runState.landmarkTriggered,
    };

    setRunHistory((prev) => [historyItem, ...prev]);
    setRunState((prev) => ({
      ...prev,
      isRunning: false,
      runCompleted: true,
    }));
    return historyItem;
  }, [routeState.selectedRouteId, routeState.selectedRouteName, routeState.selectedRouteType, runState.distance, runState.duration, runState.landmarkTriggered, runState.pace]);

  const saveHistoricalReward = useCallback(() => {
    const rewardTemplate = historicalRewards[routeState.selectedRouteId] ?? defaultHistoricalReward;
    const existingReward = treasureRewards.find(
      (item) => item.sourceRouteId === rewardTemplate.sourceRouteId,
    );

    if (existingReward) {
      setRewardState({
        rewardType: existingReward.rewardType,
        rewardName: existingReward.rewardName,
        rewardImage: existingReward.rewardImage,
        sourceRouteId: existingReward.sourceRouteId,
      });
      return existingReward;
    }

    const rewardItem: TreasureRewardItem = {
      id: `reward-${Date.now()}`,
      rewardType: rewardTemplate.rewardType,
      rewardName: rewardTemplate.rewardName,
      rewardImage: rewardTemplate.rewardImage,
      sourceRouteId: rewardTemplate.sourceRouteId,
      sourceRouteName: rewardTemplate.sourceRouteName,
      earnedAt: new Date().toISOString(),
    };

    setRewardState({
      rewardType: rewardItem.rewardType,
      rewardName: rewardItem.rewardName,
      rewardImage: rewardItem.rewardImage,
      sourceRouteId: rewardItem.sourceRouteId,
    });
    setTreasureRewards((prev) => [rewardItem, ...prev]);
    return rewardItem;
  }, [routeState.selectedRouteId, treasureRewards]);

  const resetRunState = useCallback(() => {
    setRunState(defaultRunState);
  }, []);

  const value = useMemo<DemoContextType>(
    () => ({
      userState,
      routeState,
      runState,
      rewardState,
      selectedRoute,
      selectedCompanion: userState.selectedCompanion,
      runHistory,
      treasureRewards,
      routes,
      companions,
      setUserProfile,
      markOnboardingSeen,
      selectRoute,
      startRun,
      setLocationStatus,
      updateRunMetrics,
      triggerLandmarkDiscovery,
      expandHistoricalCard,
      closeDiscovery,
      completeRun,
      saveHistoricalReward,
      resetRunState,
    }),
    [rewardState, routeState, runHistory, runState, selectedRoute, treasureRewards, userState],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
