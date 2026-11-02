import type { ComponentType } from 'react';
import type { GameProps } from '@/games/core/contract/game';
import type { SettingsSchema } from '@/games/core/contract/settings';
import { ninjaSettings } from './ninja/settings';
import { combinacionesSettings } from './combinaciones/settings';
import { catapultaSettings } from './catapulta/settings';
import type { GameId } from '@/lib/plans';

/**
 * The games Lucero's guests can play while the food is on its way. Solo games run on the phone alone; table games
 * («mesa», fase 7–9) open a room others join. Which plan includes which game is in content/plans.json.
 * Copied from games-market (477d574): see docs/procedencia.md.
 */
export interface GameEntry {
  id: GameId;
  kind: 'solo' | 'mesa';
  settings: SettingsSchema;
  load: () => Promise<{ default: ComponentType<GameProps> }>;
}

export const GAMES: GameEntry[] = [
  { id: 'ninja', kind: 'solo', settings: ninjaSettings, load: () => import('./ninja/NinjaGame') as Promise<{ default: ComponentType<GameProps> }> },
  { id: 'combinaciones', kind: 'solo', settings: combinacionesSettings, load: () => import('./combinaciones/CombinacionesGame') as Promise<{ default: ComponentType<GameProps> }> },
  { id: 'catapulta', kind: 'solo', settings: catapultaSettings, load: () => import('./catapulta/CatapultaGame') as Promise<{ default: ComponentType<GameProps> }> },
];

export const gameById = (id: GameId) => GAMES.find((g) => g.id === id) ?? null;
