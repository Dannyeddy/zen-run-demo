import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TreasureItem {
  id: number;
  title: string;
  img: string;
}

interface PetContextType {
  equippedItem: TreasureItem | null;
  equipItem: (item: TreasureItem) => void;
  foodInventory: number;
  petVitality: number;
  petAffinity: number;
  feedPet: () => void;
  addFood: (count: number) => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [equippedItem, setEquippedItem] = useState<TreasureItem | null>(null);
  const [foodInventory, setFoodInventory] = useState(3); // Start with some for demo
  const [petVitality, setPetVitality] = useState(65);
  const [petAffinity, setPetAffinity] = useState(40);

  const equipItem = (item: TreasureItem) => {
    setEquippedItem(item);
  };

  const feedPet = () => {
    if (foodInventory > 0) {
      setFoodInventory(prev => prev - 1);
      setPetVitality(prev => Math.min(100, prev + 15));
      setPetAffinity(prev => prev + 5);
    }
  };

  const addFood = (count: number) => {
    setFoodInventory(prev => prev + count);
  };

  return (
    <PetContext.Provider value={{ 
      equippedItem, 
      equipItem, 
      foodInventory, 
      petVitality, 
      petAffinity, 
      feedPet, 
      addFood 
    }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePet must be used within a PetProvider');
  }
  return context;
};
