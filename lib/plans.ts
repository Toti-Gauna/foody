import plansJson from '@/content/plans.json';

/**
 * The three plans of «Eclipse para restaurantes» (content/plans.json, Ignacio 02/11/2026). Every price on the site and
 * in the demo is read from here. A plan includes everything in the cheaper ones.
 */
export const PLAN_IDS = ['25', '50', '75'] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export type Feature = 'carta' | 'gus' | 'crm' | 'juegos' | 'ruleta' | 'mesa' | 'academy';
export type GameId = 'ninja' | 'combinaciones' | 'catapulta' | 'dibujo' | 'hockey';

export interface Plan {
  id: PlanId;
  priceUsd: number;
  features: Feature[];
  games: GameId[];
}

export const plans = plansJson.plans as Plan[];
export const planById = (id: PlanId): Plan => plans.find((p) => p.id === id) as Plan;

export const isPlanId = (value: unknown): value is PlanId => typeof value === 'string' && (PLAN_IDS as readonly string[]).includes(value);

/** Reads `?plan=` (anything off the list is ignored and the demo shows everything: the top plan). */
export const planFromSearch = (search: string): PlanId | null => {
  const value = new URLSearchParams(search).get('plan');
  return isPlanId(value) ? value : null;
};

export const includes = (plan: PlanId, feature: Feature) => planById(plan).features.includes(feature);

/** The cheapest plan that includes a feature (what a lock says: «Desde el plan 50»). */
export const firstPlanWith = (feature: Feature): Plan => plans.find((p) => p.features.includes(feature)) as Plan;
export const firstPlanWithGame = (game: GameId): Plan => plans.find((p) => p.games.includes(game)) as Plan;

export const formatUsd = (usd: number) => `USD ${usd}`;
