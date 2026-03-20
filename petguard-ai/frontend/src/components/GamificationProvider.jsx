import React, { createContext, useContext, useEffect, useState } from 'react';

const GamificationContext = createContext({
  points: 0,
  badges: [],
  awardForPetAdded: () => {},
  awardForHygieneTask: () => {},
});

const PET_POINTS = 20;
const HYGIENE_POINTS = 10;

const computeBadges = (points) => {
  const badges = [];
  if (points >= 20) {
    badges.push('Responsible Owner');
  }
  if (points >= 60) {
    badges.push('Hygiene Pro');
  }
  return badges;
};

export const GamificationProvider = ({ children }) => {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const stored = window.localStorage.getItem('petguard-points');
    if (stored) {
      const parsed = Number(stored);
      if (!Number.isNaN(parsed)) {
        setPoints(parsed);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('petguard-points', String(points));
  }, [points]);

  const award = (delta) => {
    setPoints((prev) => prev + delta);
  };

  const value = {
    points,
    badges: computeBadges(points),
    awardForPetAdded: () => award(PET_POINTS),
    awardForHygieneTask: () => award(HYGIENE_POINTS),
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => useContext(GamificationContext);

