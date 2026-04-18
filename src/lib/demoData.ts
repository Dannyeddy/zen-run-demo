export interface CompanionOption {
  id: number;
  name: string;
  type: string;
  img: string;
}

export interface RouteOption {
  id: string;
  title: string;
  dist: string;
  time: string;
  type: 'Historical' | 'Modern';
  reward: string;
  description: string;
  img: string;
}

export interface RewardTemplate {
  rewardType: 'treasure';
  rewardName: string;
  rewardImage: string;
  sourceRouteId: string;
  sourceRouteName: string;
}

export const companions: CompanionOption[] = [
  {
    id: 1,
    name: 'Aqua Pup',
    type: 'Energetic',
    img: 'https://api.dicebear.com/7.x/bottts/svg?seed=aqua&backgroundColor=b6e3f4',
  },
  {
    id: 2,
    name: 'Mint Cat',
    type: 'Calm',
    img: 'https://api.dicebear.com/7.x/bottts/svg?seed=mint&backgroundColor=b6e3f4',
  },
  {
    id: 3,
    name: 'Zen Fox',
    type: 'Wise',
    img: 'https://api.dicebear.com/7.x/bottts/svg?seed=zen&backgroundColor=b6e3f4',
  },
];

export const routes: RouteOption[] = [
  {
    id: 'h1',
    title: 'Ancient Temple Path',
    dist: '3.2 km',
    time: '25 min',
    type: 'Historical',
    reward: 'Ancient Silk Fan',
    description:
      'Explore the remnants of the Ming dynasty gardens. This path hides fragments of lost history.',
    img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'm1',
    title: 'Riverside Serenity',
    dist: '5.0 km',
    time: '40 min',
    type: 'Modern',
    reward: 'Premium Pet Food',
    description:
      'A smooth asphalt path along the river. Perfect for maintaining peak vitality.',
    img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'h2',
    title: 'Silk Road Echoes',
    dist: '6.4 km',
    time: '50 min',
    type: 'Historical',
    reward: 'Jade Ornament',
    description:
      'Trace the steps of ancient traders through this desert-inspired landscape.',
    img: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'm2',
    title: 'Urban Jungle Beat',
    dist: '3.5 km',
    time: '22 min',
    type: 'Modern',
    reward: 'Energy Mix',
    description: 'Navigate through the city park with high intensity sprints.',
    img: 'https://images.unsplash.com/photo-1444418185997-1145401101e0?auto=format&fit=crop&q=80&w=400',
  },
];

export const historicalRewards: Record<string, RewardTemplate> = {
  h1: {
    rewardType: 'treasure',
    rewardName: 'Ancient Silk Fan',
    rewardImage:
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800',
    sourceRouteId: 'h1',
    sourceRouteName: 'Ancient Temple Path',
  },
  h2: {
    rewardType: 'treasure',
    rewardName: 'Jade Ornament',
    rewardImage:
      'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=800',
    sourceRouteId: 'h2',
    sourceRouteName: 'Silk Road Echoes',
  },
};

export const defaultHistoricalReward = historicalRewards.h1;
