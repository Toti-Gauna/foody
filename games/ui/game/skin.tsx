'use client';

import { createContext, useContext } from 'react';

/**
 * Foody: how a host dresses the shared stage without touching each game. With a skin, the intro becomes a card with
 * the game's art, name and line, and every label of the stage comes from the host (translated). Without one, the stage
 * looks and reads as in games-market.
 */
export interface GameSkin {
  art?: string;
  title: string;
  tagline?: string;
  labels: {
    play: string;
    sound: string;
    soundOff: string;
    fullscreen: string;
    exitFullscreen: string;
    pause: string;
    paused: string;
    pausedHint: string;
    resume: string;
    restart: string;
    again: string;
    go: string;
  };
}

const SkinCtx = createContext<GameSkin | null>(null);
export const GameSkinProvider = SkinCtx.Provider;
export const useGameSkin = () => useContext(SkinCtx);
